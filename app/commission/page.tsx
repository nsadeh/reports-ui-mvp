"use client";

import { useState } from "react";

export default function CommissionPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="bg-bg2 border border-border rounded-lg p-8 text-center">
          <div className="w-12 h-12 bg-lime/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✓</span>
          </div>
          <h2 className="text-xl font-semibold text-dark mb-2">
            Report Commissioned
          </h2>
          <p className="text-body mb-4">
            Your custom report request has been received. Reference:{" "}
            <span className="font-mono font-medium text-accent">
              CR-2026-0042
            </span>
          </p>
          <p className="text-sm text-muted mb-6">
            Estimated delivery: March 11, 2026. An analyst will reach out if
            clarification is needed.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-4 py-2 text-sm text-accent border border-accent rounded-md hover:bg-accent/5 transition-colors"
          >
            Commission Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-dark mb-2">
        Commission a Report
      </h2>
      <p className="text-body mb-8">
        Request a custom deep-dive analysis from our analyst team.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="space-y-6"
      >
        {/* Scope */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1">
            Scope
          </label>
          <select className="w-full px-3 py-2 text-sm border border-border rounded-md bg-bg focus:outline-none focus:border-accent">
            <option>TNF-alpha — Target Area</option>
            <option>Rheumatoid Arthritis — Indication</option>
            <option>Plaque Psoriasis — Indication</option>
            <option>Inflammatory Bowel Disease — Disease Area</option>
          </select>
        </div>

        {/* Focus area */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1">
            Focus Area
          </label>
          <textarea
            rows={3}
            placeholder="What specific question or area do you want the report to focus on?"
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-bg focus:outline-none focus:border-accent resize-none"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1">
            Priority
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-body cursor-pointer">
              <input
                type="radio"
                name="priority"
                value="standard"
                defaultChecked
                className="accent-accent"
              />
              Standard (5 business days)
            </label>
            <label className="flex items-center gap-2 text-sm text-body cursor-pointer">
              <input
                type="radio"
                name="priority"
                value="expedited"
                className="accent-accent"
              />
              Expedited (48 hours)
            </label>
          </div>
        </div>

        {/* Delivery preference */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1">
            Delivery
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-body cursor-pointer">
              <input
                type="radio"
                name="delivery"
                value="one-time"
                defaultChecked
                className="accent-accent"
              />
              One-time
            </label>
            <label className="flex items-center gap-2 text-sm text-body cursor-pointer">
              <input
                type="radio"
                name="delivery"
                value="recurring"
                className="accent-accent"
              />
              Add to recurring schedule
            </label>
          </div>
        </div>

        {/* Additional context */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1">
            Additional Context{" "}
            <span className="text-muted font-normal">(optional)</span>
          </label>
          <textarea
            rows={2}
            placeholder="Any specific drugs, payers, or events you want us to prioritize?"
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-bg focus:outline-none focus:border-accent resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full px-5 py-2.5 bg-lime text-dark font-semibold text-sm rounded-lg hover:bg-lime/80 transition-colors"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}
