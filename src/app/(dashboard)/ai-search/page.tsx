"use client";

import { useState } from "react";
import { Sparkles, Send, Bot, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const EXAMPLE_QUERIES = [
  "Fellowships for early-career researchers in AI",
  "Grants for climate tech startups",
  "Youth leadership programs in Africa",
];

export default function AiSearchPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">AI Search</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe what you're looking for in natural language.
        </p>
      </div>

      {/* Search card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <div className="rounded-lg bg-primary/10 p-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            Semantic Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. 'research grants for women in STEM under 30'"
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && query.trim()}
            />
            <Button disabled={!query.trim()}>
              <Send className="h-4 w-4" />
              Search
            </Button>
          </div>

          {/* Example queries */}
          <div className="mt-4 flex flex-wrap gap-2">
            {EXAMPLE_QUERIES.map((q) => (
              <button
                key={q}
                onClick={() => setQuery(q)}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                {q}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results placeholder */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <div className="mb-4 flex gap-3">
            <div className="rounded-full bg-primary/10 p-3">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div className="rounded-full bg-muted p-3">
              <User className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          <p className="font-medium text-foreground">Ask the AI anything</p>
          <p className="mt-1 text-sm">
            Results will appear here after your search.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
