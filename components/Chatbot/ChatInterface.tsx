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

interface State {
  phase: Phase;
  inputText: string;
  hours: number;
  workflowNodes: WorkflowNode[];
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
    case "SUBMIT_INPUT":
      return { ...state, phase: { type: "thinking", input: action.input }, inputText: "" };
    case "THINKING_DONE":
      return { ...state, phase: { type: "question", nodeId: action.nodeId, answers: [] } };
    case "SELECT_CHIP": {
      if (state.phase.type !== "question") return state;
      const { nodeId, answers } = state.phase;
      const alreadySelected = answers.includes(action.chipId);
      const newAnswers = alreadySelected
        ? answers.filter((a) => a !== action.chipId)
        : [action.chipId];
      return { ...state, phase: { type: "question", nodeId, answers: newAnswers } };
    }
    case "NEXT_FROM_QUESTION": {
      if (state.phase.type !== "question") return state;
      const { nodeId, answers } = state.phase;
      const chipId = answers[0] ?? "";
      const { nextNodeId, solutionId, track } = resolveTrackAndSolution(nodeId, chipId);

      if (nextNodeId === "consulting_track" || nextNodeId === "roi_step") {
        const nodes = buildWorkflowNodes(solutionId, "da");
        return {
          ...state,
          workflowNodes: nodes,
          phase: { type: "roi", answers, solutionId, track },
        };
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
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.phase.type]);

  useEffect(() => {
    if (state.phase.type === "thinking") {
      const delay = 1500 + Math.random() * 500;
      const firstChipId = Object.keys(
        (tree.nodes as Record<string, { chips?: { id: string }[] }>)["root"].chips ?? []
      )[0];
      const initialNodeId = resolveNext("root", (state.phase as { input: string }).input.toLowerCase().slice(0, 12));
      const nodeId = Object.keys(tree.nodes).includes(initialNodeId) ? initialNodeId : "customer_modules";
      const timer = setTimeout(() => dispatch({ type: "THINKING_DONE", nodeId }), delay);
      return () => clearTimeout(timer);
    }
  }, [state.phase.type]);

  type QuestionNode = { prompt_da: string; prompt_en: string; chips: { id: string; label_da: string; label_en: string }[] };
  const nodesAsQuestion = tree.nodes as unknown as Record<string, QuestionNode>;

  const currentNode =
    state.phase.type === "question" ? nodesAsQuestion[state.phase.nodeId] : null;

  const rootNode = nodesAsQuestion["root"];

  const mascotState =
    state.phase.type === "thinking"
      ? "thinking"
      : state.phase.type === "contact"
      ? "working"
      : "idle";

  const currentSolution =
    (state.phase.type === "reveal" || state.phase.type === "contact") && state.phase.solutionId
      ? (solutions as Record<string, { id: string; title_da: string; title_en: string; description_da: string; description_en: string; price_dkk_month: number; track: "saas" | "consulting" }>)[state.phase.solutionId]
      : null;

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Chat panel */}
      <div className="flex-1 flex flex-col p-6 md:p-10 overflow-y-auto max-h-screen">
        {/* Header with mascot */}
        <div className="flex items-start gap-4 mb-8">
          <RobotMascot state={mascotState} />
          <div>
            <p className="text-[#F0EDE6]/50 text-xs font-mono mb-1">nrdnfjrd.io</p>
            <h1 className="text-2xl md:text-3xl font-bold text-[#F0EDE6] leading-tight">
              {locale === "da" ? rootNode.prompt_da : rootNode.prompt_en}
            </h1>
          </div>
        </div>

        {/* Opening: input + chips */}
        {state.phase.type === "opening" && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={state.inputText}
                onChange={(e) => {}}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && state.inputText.trim()) {
                    dispatch({ type: "SUBMIT_INPUT", input: state.inputText });
                  }
                }}
                placeholder={t("placeholder")}
                className="flex-1 bg-transparent border border-[#F0EDE6]/20 px-4 py-2.5 font-mono text-sm text-[#F0EDE6] placeholder-[#F0EDE6]/30 focus:outline-none focus:border-[#F5A623] transition-colors"
              />
              <button
                onClick={() => {
                  if (state.inputText.trim()) dispatch({ type: "SUBMIT_INPUT", input: state.inputText });
                }}
                className="px-4 py-2.5 bg-[#F5A623] text-[#0D1117] font-mono text-sm font-bold hover:bg-[#F5A623]/90 transition-colors"
              >
                →
              </button>
            </div>
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

        {/* Thinking */}
        {state.phase.type === "thinking" && (
          <div className="flex items-center gap-2 text-[#F5A623] font-mono text-sm">
            <span>{t("thinking")}</span>
            <span className="animate-pulse">▋</span>
          </div>
        )}

        {/* Question */}
        {state.phase.type === "question" && currentNode && (
          <div className="space-y-4">
            <p className="text-[#F0EDE6] font-medium">
              {locale === "da" ? currentNode.prompt_da : currentNode.prompt_en}
            </p>
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
                className="mt-2 px-4 py-2 bg-[#F5A623] text-[#0D1117] font-mono text-sm font-bold hover:bg-[#F5A623]/90 transition-colors"
              >
                →
              </button>
            )}
          </div>
        )}

        {/* ROI */}
        {state.phase.type === "roi" && (
          <div className="space-y-4">
            <ROICalculator
              hours={state.hours}
              onHoursChange={(h) => dispatch({ type: "SET_HOURS", hours: h })}
              label={t("roiQuestion")}
              unit={t("roiUnit")}
              resultTemplate={t("roiResult")}
            />
            <button
              onClick={() => dispatch({ type: "SHOW_CONTACT" })}
              className="mt-2 px-4 py-2 bg-[#F5A623] text-[#0D1117] font-mono text-sm font-bold hover:bg-[#F5A623]/90 transition-colors"
            >
              →
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

      {/* Workflow visualizer panel — hidden on mobile */}
      {state.workflowNodes.length > 0 && (
        <div className="hidden md:flex flex-col justify-center px-6 py-10 border-l border-[#F0EDE6]/10 min-w-[340px]">
          <p className="text-[#F0EDE6]/40 text-xs font-mono mb-4">workflow</p>
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
