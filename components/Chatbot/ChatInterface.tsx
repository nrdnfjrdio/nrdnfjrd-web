"use client";

import { useEffect, useReducer, useRef } from "react";
import { useTranslations } from "next-intl";
import SuggestionChips from "./SuggestionChips";
import ROICalculator from "./ROICalculator";
import WorkflowVisualizer from "./WorkflowVisualizer";
import RobotMascot from "./RobotMascot";
import SolutionReveal from "./SolutionReveal";
import ContactForm from "./ContactForm";
import tree from "@/lib/decisionTree.json";
import solutions from "@/lib/solutions.json";

type Phase =
  | { type: "opening" }
  | { type: "thinking"; input: string }
  | { type: "question"; nodeId: string; answers: string[] }
  | { type: "roi"; answers: string[]; solutionId: string | null; track: "saas" | "consulting" }
  | { type: "reveal"; track: "saas" | "consulting"; solutionId: string | null; hours: number }
  | { type: "contact"; track: "saas" | "consulting"; solutionId: string | null }
  | { type: "done" };

type Action =
  | { type: "SUBMIT_INPUT"; input: string }
  | { type: "SET_INPUT"; input: string }
  | { type: "THINKING_DONE"; nodeId: string }
  | { type: "SELECT_CHIP"; chipId: string }
  | { type: "NEXT_FROM_QUESTION" }
  | { type: "SET_HOURS"; hours: number }
  | { type: "SHOW_CONTACT" }
  | { type: "COMPLETE" };

interface WorkflowNode {
  id: string;
  label: string;
  color: string;
  x: number;
  y: number;
}

interface Message {
  role: "bot" | "user";
  text: string;
}

interface State {
  phase: Phase;
  inputText: string;
  hours: number;
  workflowNodes: WorkflowNode[];
  messages: Message[];
}

const NODE_LABELS: Record<string, { da: string; en: string }> = {
  intake: { da: "Modtager", en: "Intake" },
  email_parser: { da: "Email Parser", en: "Email Parser" },
  booking_sync: { da: "Booking Sync", en: "Booking Sync" },
  reply_gen: { da: "Svar Generator", en: "Reply Gen" },
  crm_update: { da: "CRM Update", en: "CRM Update" },
  document_intake: { da: "Dokument Intake", en: "Document Intake" },
  ocr_extract: { da: "OCR Udtræk", en: "OCR Extract" },
  data_validate: { da: "Validering", en: "Validate" },
  system_push: { da: "System Push", en: "System Push" },
  data_collect: { da: "Data Hent", en: "Data Collect" },
  transform: { da: "Transformer", en: "Transform" },
  report_gen: { da: "Rapport Gen", en: "Report Gen" },
  email_delivery: { da: "Email Levering", en: "Email Delivery" },
};

function resolveNext(nodeId: string, chipId: string): string {
  const node = (tree.nodes as Record<string, { next?: Record<string, string> }>)[nodeId];
  if (!node?.next) return "consulting_track";
  return node.next[chipId] ?? node.next["*"] ?? "consulting_track";
}

function resolveTrackAndSolution(
  nodeId: string,
  chipId: string
): { nextNodeId: string; solutionId: string | null; track: "saas" | "consulting" } {
  const next = resolveNext(nodeId, chipId);
  if (next === "consulting_track") return { nextNodeId: next, solutionId: null, track: "consulting" };
  const node = (tree.nodes as Record<string, { solution?: string }>)[nodeId];
  const solutionId = node?.solution ?? null;
  return { nextNodeId: next, solutionId, track: next === "roi_step" && solutionId ? "saas" : "consulting" };
}

function buildWorkflowNodes(solutionId: string | null, locale: string): WorkflowNode[] {
  if (!solutionId) return [];
  const sol = (solutions as Record<string, { nodes: string[]; node_colors: Record<string, string> }>)[solutionId];
  if (!sol) return [];
  return sol.nodes.map((id, i) => ({
    id,
    label: NODE_LABELS[id]?.[locale as "da" | "en"] ?? id,
    color: sol.node_colors[id] ?? "#4A90D9",
    x: i * 176 + 20,
    y: 32,
  }));
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_INPUT":
      return { ...state, inputText: action.input };
    case "SUBMIT_INPUT": {
      const userMsg: Message = { role: "user", text: action.input };
      return {
        ...state,
        phase: { type: "thinking", input: action.input },
        inputText: "",
        messages: [...state.messages, userMsg],
      };
    }
    case "THINKING_DONE":
      return { ...state, phase: { type: "question", nodeId: action.nodeId, answers: [] } };
    case "SELECT_CHIP": {
      if (state.phase.type !== "question") return state;
      const { nodeId, answers } = state.phase;
      const alreadySelected = answers.includes(action.chipId);
      const newAnswers = alreadySelected ? answers.filter((a) => a !== action.chipId) : [action.chipId];
      return { ...state, phase: { type: "question", nodeId, answers: newAnswers } };
    }
    case "NEXT_FROM_QUESTION": {
      if (state.phase.type !== "question") return state;
      const { nodeId, answers } = state.phase;
      const chipId = answers[0] ?? "";
      const { nextNodeId, solutionId, track } = resolveTrackAndSolution(nodeId, chipId);
      if (nextNodeId === "consulting_track" || nextNodeId === "roi_step") {
        const nodes = buildWorkflowNodes(solutionId, "da");
        return { ...state, workflowNodes: nodes, phase: { type: "roi", answers, solutionId, track } };
      }
      return { ...state, phase: { type: "question", nodeId: nextNodeId, answers: [] } };
    }
    case "SET_HOURS":
      return { ...state, hours: action.hours };
    case "SHOW_CONTACT": {
      if (state.phase.type !== "roi") return state;
      const { solutionId, track } = state.phase;
      return { ...state, phase: { type: "reveal", track, solutionId, hours: state.hours } };
    }
    case "COMPLETE": {
      if (state.phase.type !== "reveal") return state;
      const { track, solutionId } = state.phase;
      return { ...state, phase: { type: "contact", track, solutionId } };
    }
    default:
      return state;
  }
}

export default function ChatInterface({ locale }: { locale: string }) {
  const t = useTranslations("chat");
  const tContact = useTranslations("contact");
  const [state, dispatch] = useReducer(reducer, {
    phase: { type: "opening" },
    inputText: "",
    hours: 5,
    workflowNodes: [],
    messages: [],
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.phase.type, state.messages.length]);

  useEffect(() => {
    if (state.phase.type === "thinking") {
      const delay = 1400 + Math.random() * 600;
      const initialNodeId = resolveNext("root", (state.phase as { input: string }).input.toLowerCase().slice(0, 12));
      const nodeId = Object.keys(tree.nodes).includes(initialNodeId) ? initialNodeId : "customer_modules";
      const timer = setTimeout(() => dispatch({ type: "THINKING_DONE", nodeId }), delay);
      return () => clearTimeout(timer);
    }
  }, [state.phase.type]);

  useEffect(() => {
    if (state.phase.type === "opening") {
      inputRef.current?.focus();
    }
  }, [state.phase.type]);

  type QuestionNode = { prompt_da: string; prompt_en: string; chips: { id: string; label_da: string; label_en: string }[] };
  const nodesAsQuestion = tree.nodes as unknown as Record<string, QuestionNode>;
  const currentNode = state.phase.type === "question" ? nodesAsQuestion[state.phase.nodeId] : null;
  const rootNode = nodesAsQuestion["root"];

  const mascotState =
    state.phase.type === "thinking" ? "thinking" :
    state.phase.type === "contact"  ? "working"  :
    "idle";

  const currentSolution =
    (state.phase.type === "reveal" || state.phase.type === "contact") && state.phase.solutionId
      ? (solutions as Record<string, {
          id: string; title_da: string; title_en: string;
          description_da: string; description_en: string;
          price_dkk_month: number; track: "saas" | "consulting"
        }>)[state.phase.solutionId]
      : null;

  const handleSubmit = () => {
    const v = state.inputText.trim();
    if (v) dispatch({ type: "SUBMIT_INPUT", input: v });
  };

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden">

      {/* ── Left panel: mascot + brand ── */}
      <div className="hidden md:flex flex-col items-center justify-center gap-6 px-8 py-10 border-r border-[#F0EDE6]/8 min-w-[240px] max-w-[280px] bg-[#0a0f15]">
        <div className="flex flex-col items-center gap-4">
          <RobotMascot state={mascotState} />
          <div className="text-center">
            <p className="text-[#F5A623] font-mono text-xs tracking-widest uppercase mb-1">nrdnfjrd.io</p>
            <p className="text-[#F0EDE6]/40 font-mono text-xs leading-relaxed">
              {locale === "da" ? "Vi automatiserer det,\ndu ikke gider." : "We automate what\nyou don't want to do."}
            </p>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 mt-auto">
          <span className={`w-2 h-2 rounded-none ${state.phase.type === "thinking" ? "bg-[#F5A623] animate-pulse" : "bg-[#4A90D9]"}`} />
          <span className="text-[#F0EDE6]/30 font-mono text-xs">
            {state.phase.type === "thinking" ? "processing..." :
             state.phase.type === "contact"  ? "ready" : "online"}
          </span>
        </div>
      </div>

      {/* ── Right panel: terminal chat ── */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">

        {/* Terminal title bar */}
        <div className="terminal-titlebar flex items-center gap-2 px-4 py-2.5 shrink-0">
          <span className="w-3 h-3 bg-[#FF5F57] block" />
          <span className="w-3 h-3 bg-[#FFBD2E] block" />
          <span className="w-3 h-3 bg-[#28CA41] block" />
          <span className="flex-1 text-center text-[#F0EDE6]/30 font-mono text-xs tracking-widest">
            nrdnfjrd — agent v1.0
          </span>
          {/* Mobile mascot */}
          <div className="md:hidden">
            <RobotMascot state={mascotState} />
          </div>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-5 md:px-8 py-6 space-y-5 scanlines relative">

          {/* Opening bot message */}
          <div className="msg-bot">
            <p className="font-mono text-xs text-[#F5A623]/60 mb-1">nrd_agent</p>
            <p className="text-[#F0EDE6] text-sm md:text-base font-medium leading-relaxed">
              {locale === "da" ? rootNode.prompt_da : rootNode.prompt_en}
            </p>
          </div>

          {/* User message history */}
          {state.messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="msg-user">
                <span className="font-mono text-xs opacity-60 mr-2">&gt;_</span>
                {m.text}
              </div>
            ) : (
              <div key={i} className="msg-bot">
                <p className="font-mono text-xs text-[#F5A623]/60 mb-1">nrd_agent</p>
                <p className="text-[#F0EDE6] text-sm leading-relaxed">{m.text}</p>
              </div>
            )
          )}

          {/* Thinking */}
          {state.phase.type === "thinking" && (
            <div className="flex items-center gap-1.5 text-[#F5A623]/80 font-mono text-sm">
              <span className="text-[#F5A623]/40">nrd_agent</span>
              <span className="mx-2 text-[#F0EDE6]/20">|</span>
              <span className="dot-1 w-1.5 h-1.5 bg-[#F5A623] block rounded-none" />
              <span className="dot-2 w-1.5 h-1.5 bg-[#F5A623] block rounded-none" />
              <span className="dot-3 w-1.5 h-1.5 bg-[#F5A623] block rounded-none" />
            </div>
          )}

          {/* Opening: suggestion chips */}
          {state.phase.type === "opening" && (
            <div className="space-y-3 pt-1">
              <SuggestionChips
                chips={rootNode.chips.map((c) => ({
                  id: c.id,
                  label: locale === "da" ? c.label_da : c.label_en,
                }))}
                selected={[]}
                onSelect={(id) => dispatch({ type: "SUBMIT_INPUT", input: id })}
              />
            </div>
          )}

          {/* Question */}
          {state.phase.type === "question" && currentNode && (
            <div className="space-y-4">
              <div className="msg-bot">
                <p className="font-mono text-xs text-[#F5A623]/60 mb-1">nrd_agent</p>
                <p className="text-[#F0EDE6] text-sm md:text-base font-medium leading-relaxed">
                  {locale === "da" ? currentNode.prompt_da : currentNode.prompt_en}
                </p>
              </div>
              <SuggestionChips
                chips={currentNode.chips.map((c) => ({
                  id: c.id,
                  label: locale === "da" ? c.label_da : c.label_en,
                }))}
                selected={state.phase.answers}
                onSelect={(id) => dispatch({ type: "SELECT_CHIP", chipId: id })}
              />
              {state.phase.answers.length > 0 && (
                <button
                  onClick={() => dispatch({ type: "NEXT_FROM_QUESTION" })}
                  className="flex items-center gap-2 px-4 py-2 bg-[#F5A623] text-[#0D1117] font-mono text-sm font-bold hover:bg-[#F5A623]/90 transition-colors"
                >
                  <span>{locale === "da" ? "Fortsæt" : "Continue"}</span>
                  <span>→</span>
                </button>
              )}
            </div>
          )}

          {/* ROI */}
          {state.phase.type === "roi" && (
            <div className="space-y-4">
              <div className="msg-bot">
                <p className="font-mono text-xs text-[#F5A623]/60 mb-1">nrd_agent</p>
              </div>
              <ROICalculator
                hours={state.hours}
                onHoursChange={(h) => dispatch({ type: "SET_HOURS", hours: h })}
                label={t("roiQuestion")}
                unit={t("roiUnit")}
                resultTemplate={t("roiResult")}
              />
              <button
                onClick={() => dispatch({ type: "SHOW_CONTACT" })}
                className="flex items-center gap-2 px-4 py-2 bg-[#F5A623] text-[#0D1117] font-mono text-sm font-bold hover:bg-[#F5A623]/90 transition-colors"
              >
                <span>{locale === "da" ? "Se din løsning" : "See your solution"}</span>
                <span>→</span>
              </button>
            </div>
          )}

          {/* Reveal */}
          {state.phase.type === "reveal" && (
            <SolutionReveal
              solution={currentSolution ?? null}
              track={state.phase.track}
              locale={locale}
              hoursPerWeek={state.hours}
              onCTA={() => dispatch({ type: "COMPLETE" })}
              t={{
                saasReveal: {
                  badge: t("saasReveal.badge"),
                  ready: t("saasReveal.ready"),
                  cta: t("saasReveal.cta"),
                },
                consultingReveal: {
                  badge: t("consultingReveal.badge"),
                  message: t("consultingReveal.message"),
                  saving: t("consultingReveal.saving"),
                  cta: t("consultingReveal.cta"),
                },
              }}
            />
          )}

          {/* Contact */}
          {state.phase.type === "contact" && (
            <ContactForm
              t={{
                title: tContact("title"),
                name: tContact("name"),
                company: tContact("company"),
                email: tContact("email"),
                phone: tContact("phone"),
                submit: tContact("submit"),
                success: tContact("success"),
                error: tContact("error"),
              }}
              onSuccess={() => dispatch({ type: "COMPLETE" } as Action)}
            />
          )}

          <div ref={bottomRef} />
        </div>

        {/* ── Terminal input ── */}
        {state.phase.type === "opening" && (
          <div className="shrink-0 border-t border-[#F0EDE6]/8 px-5 md:px-8 py-3 bg-[#0a0f15] flex items-center gap-3">
            <span className="text-[#F5A623] font-mono text-sm select-none">&gt;_</span>
            <input
              ref={inputRef}
              type="text"
              value={state.inputText}
              onChange={(e) => dispatch({ type: "SET_INPUT", input: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              placeholder={t("placeholder")}
              className="flex-1 bg-transparent font-mono text-sm text-[#F0EDE6] placeholder-[#F0EDE6]/25 focus:outline-none caret-[#F5A623]"
            />
            <button
              onClick={handleSubmit}
              className="px-3 py-1.5 bg-[#F5A623] text-[#0D1117] font-mono text-xs font-bold hover:bg-[#F5A623]/90 transition-colors shrink-0"
            >
              SEND
            </button>
          </div>
        )}
      </div>

      {/* ── Workflow visualizer panel ── */}
      {state.workflowNodes.length > 0 && (
        <div className="hidden lg:flex flex-col justify-center px-6 py-10 border-l border-[#F0EDE6]/8 min-w-[320px] max-w-[380px] bg-[#0a0f15]">
          <p className="text-[#F0EDE6]/30 text-xs font-mono mb-2 tracking-widest uppercase">workflow</p>
          <div className="w-1 h-4 bg-[#F5A623] mb-4" />
          <WorkflowVisualizer
            nodes={state.workflowNodes}
            isConsulting={
              (state.phase.type === "roi" || state.phase.type === "reveal" || state.phase.type === "contact") &&
              (state.phase as { track: string }).track === "consulting"
            }
          />
        </div>
      )}
    </div>
  );
}
