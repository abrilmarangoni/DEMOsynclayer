"use client";

import { useEffect, useMemo, useState } from "react";
import Logo from "./components/Logo";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { BtnGhost, BtnPrimary, Input, Label, Overlay, StepDots } from "./components/shared";

type OnboardingStep = "project" | "figma" | "github" | "scanning";
type Section = "Overview" | "Scans" | "Tokens" | "Insights" | "Team" | "Settings" | "Billing";
type FindingSeverity = "High" | "Medium" | "Low";
type SettingsTab = "Profile" | "Integrations";
type PlanTier = "Free" | "Pro" | "Team" | "Enterprise";

const findings = [
  { component: "Button", type: "Color", severity: "High" as FindingSeverity, confidence: 92, desc: "Primary fill uses #2563EB instead of #1D4ED8 token." },
  { component: "Badge", type: "Color", severity: "High" as FindingSeverity, confidence: 89, desc: "Semantic info badge is mapped to old blue scale." },
  { component: "Card", type: "Spacing", severity: "High" as FindingSeverity, confidence: 86, desc: "Card padding in code is 16px while design token is 20px." },
  { component: "Input", type: "Typography", severity: "Medium" as FindingSeverity, confidence: 83, desc: "Weight is 400 in code and 500 in design source." },
  { component: "Avatar", type: "Structure", severity: "Medium" as FindingSeverity, confidence: 80, desc: "Corner radius differs between Figma and component output." },
  { component: "Modal", type: "Spacing", severity: "Medium" as FindingSeverity, confidence: 79, desc: "Stack gap in implementation is 12px; expected 16px." },
  { component: "Tooltip", type: "Color", severity: "Low" as FindingSeverity, confidence: 77, desc: "Background shade is slightly darker than DS token." },
  { component: "Tabs", type: "Typography", severity: "Low" as FindingSeverity, confidence: 75, desc: "Tracking is 0 in code and 0.3px in design source." },
];

const scanPhases = [
  "Fetching Figma nodes",
  "Fetching GitHub files",
  "Resolving token aliases",
  "Comparing component output",
  "Generating actionable report",
];

export default function Home() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>("project");
  const [activeSection, setActiveSection] = useState<Section>("Overview");
  const [settingsTab, setSettingsTab] = useState<SettingsTab>("Integrations");
  const [selectedFinding, setSelectedFinding] = useState(0);
  const [findingAction, setFindingAction] = useState<string | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [showFindingDrawer, setShowFindingDrawer] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [projectName, setProjectName] = useState("");
  const [template, setTemplate] = useState("Web App");
  const [teamSize, setTeamSize] = useState("2-5");
  const [templateOpen, setTemplateOpen] = useState(false);
  const [teamSizeOpen, setTeamSizeOpen] = useState(false);

  const [figmaConnected, setFigmaConnected] = useState(false);
  const [figmaMethod, setFigmaMethod] = useState<"oauth" | "url">("oauth");
  const [figmaFile, setFigmaFile] = useState("Design System v2.4");
  const [figmaFileOpen, setFigmaFileOpen] = useState(false);
  const [figmaUrl, setFigmaUrl] = useState("");

  const [repo, setRepo] = useState("acme-inc/design-system");
  const [githubConnected, setGithubConnected] = useState(true);
  const [repoOpen, setRepoOpen] = useState(false);
  const [branch, setBranch] = useState("main");
  const [branchOpen, setBranchOpen] = useState(false);
  const [monorepo, setMonorepo] = useState(true);
  const [subdir, setSubdir] = useState("packages/ui");
  const [scanOnPR, setScanOnPR] = useState(true);
  const [slackConnected, setSlackConnected] = useState(true);
  const [slackDigestEnabled, setSlackDigestEnabled] = useState(true);
  const [vercelConnected, setVercelConnected] = useState(true);
  const [vercelPreviewEnabled, setVercelPreviewEnabled] = useState(true);
  const [jiraConnected, setJiraConnected] = useState(true);
  const [jiraSyncEnabled, setJiraSyncEnabled] = useState(false);

  const [tokenFilter, setTokenFilter] = useState("All");
  const [tokenFilterOpen, setTokenFilterOpen] = useState(false);
  const [role, setRole] = useState("Editor");
  const [roleOpen, setRoleOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState("");
  const [profileWorkspaceName, setProfileWorkspaceName] = useState("hools");
  const [profileSource, setProfileSource] = useState("Design wins");
  const [profileSourceOpen, setProfileSourceOpen] = useState(false);
  const [profileWeeklyDigest, setProfileWeeklyDigest] = useState(true);
  const [profileSaved, setProfileSaved] = useState("");
  const [currentPlan, setCurrentPlan] = useState<PlanTier>("Free");
  const [upgradeTarget, setUpgradeTarget] = useState<PlanTier | null>(null);
  const [billingNotice, setBillingNotice] = useState("");

  const [scanPhase, setScanPhase] = useState(0);
  const [scanTime, setScanTime] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (onboardingStep !== "scanning") return;
    const totalMs = 6800;
    const tickEveryMs = 80;
    const startedAt = Date.now();
    setScanProgress(0);
    setScanPhase(0);
    setScanTime(0);

    const tick = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const ratio = Math.min(elapsed / totalMs, 1);
      const progress = ratio * 100;
      setScanProgress(progress);
      setScanTime(Math.floor(elapsed / 1000));
      setScanPhase(Math.min(scanPhases.length - 1, Math.floor((progress / 100) * scanPhases.length)));
    }, tickEveryMs);

    const done = setTimeout(() => {
      setIsAuthed(true);
      setActiveSection("Overview");
      setOnboardingStep("project");
      setScanPhase(0);
      setScanTime(0);
      setScanProgress(0);
    }, totalMs + 180);
    return () => {
      clearInterval(tick);
      clearTimeout(done);
    };
  }, [onboardingStep]);

  const resetSession = () => {
    setIsAuthed(false);
    setOnboardingStep("project");
    setActiveSection("Overview");
    setProjectName("");
    setTemplate("Web App");
    setTeamSize("2-5");
    setTemplateOpen(false);
    setTeamSizeOpen(false);
    setFigmaConnected(false);
    setFigmaMethod("oauth");
    setFigmaUrl("");
    setFigmaFile("Design System v2.4");
    setRepo("acme-inc/design-system");
    setGithubConnected(true);
    setBranch("main");
    setMonorepo(true);
    setSubdir("packages/ui");
    setScanOnPR(true);
    setSlackConnected(true);
    setSlackDigestEnabled(true);
    setVercelConnected(true);
    setVercelPreviewEnabled(true);
    setJiraConnected(true);
    setJiraSyncEnabled(false);
    setInviteStatus("");
    setInviteEmail("");
    setRole("Editor");
    setProfileWorkspaceName("hools");
    setProfileSource("Design wins");
    setProfileWeeklyDigest(true);
    setProfileSaved("");
    setCurrentPlan("Free");
    setUpgradeTarget(null);
    setBillingNotice("");
    setShowShare(false);
    setShowFindingDrawer(false);
    setShowLogoutConfirm(false);
  };

  const onboardingReady = useMemo(() => {
    if (onboardingStep === "project") return !!projectName.trim();
    if (onboardingStep === "figma") return figmaMethod === "oauth" ? figmaConnected : !!figmaUrl.trim();
    if (onboardingStep === "github") return !!repo.trim();
    return false;
  }, [onboardingStep, projectName, figmaMethod, figmaConnected, figmaUrl, repo]);

  const runInvite = () => {
    if (!inviteEmail.trim()) return;
    setInviteStatus(`Invite sent to ${inviteEmail} as ${role}.`);
    setInviteEmail("");
  };

  if (!isAuthed) {
    const scanPulse = 0.7 + ((Math.sin((scanProgress / 100) * Math.PI * 20) + 1) / 2) * 0.5;
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
          position: "relative",
        }}
      >
        {onboardingStep === "scanning" ? (
          <Overlay>
            <div
              style={{
                width: 420,
                borderRadius: "var(--radius-xl)",
                border: "1px solid var(--border)",
                background: "var(--surface)",
                padding: "34px 30px",
              }}
            >
              <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 6 }}>Running initial scan</h2>
              <p style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 26 }}>
                {projectName || "sync-project"} · baseline report generation
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 24 }}>
                {scanPhases.map((phase, idx) => (
                  <div key={phase} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        border: `1px solid ${idx < scanPhase ? "var(--text-3)" : idx === scanPhase ? "var(--accent-border)" : "var(--border)"}`,
                        background: idx === scanPhase ? "var(--accent-dim)" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 220ms ease",
                        transform: idx === scanPhase ? `scale(${1 + (scanPulse - 0.7) * 0.18})` : "scale(1)",
                      }}
                    >
                      {idx < scanPhase && <span style={{ fontSize: 9, color: "var(--text-2)" }}>✓</span>}
                      {idx === scanPhase && (
                        <span
                          style={{
                            width: 4,
                            height: 4,
                            borderRadius: 2,
                            background: "var(--accent)",
                            opacity: scanPulse,
                            transition: "opacity 130ms linear",
                          }}
                        />
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        color: idx <= scanPhase ? "var(--text-2)" : "var(--text-4)",
                        transition: "color 220ms ease",
                      }}
                    >
                      {phase}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ width: "100%", height: 2, borderRadius: 1, background: "var(--border)", overflow: "hidden", marginBottom: 14 }}>
                <div
                  style={{
                    width: `${scanProgress}%`,
                    height: "100%",
                    background: "var(--accent)",
                    transition: "width 120ms linear",
                  }}
                />
              </div>
              <p style={{ fontSize: 11, color: "var(--text-4)", fontFamily: "var(--font-mono)" }}>
                {String(Math.floor(scanTime / 60)).padStart(2, "0")}:{String(scanTime % 60).padStart(2, "0")} elapsed
              </p>
            </div>
          </Overlay>
        ) : (
          <div style={{ width: 520, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ marginBottom: 44 }}>
              <Logo />
            </div>
            <StepDots current={onboardingStep === "project" ? 0 : onboardingStep === "figma" ? 1 : 2} total={3} />

            {onboardingStep === "project" && (
              <div style={{ width: 420 }}>
                <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 8, letterSpacing: "-0.3px", textAlign: "center" }}>Create project</h1>
                <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 28, textAlign: "center" }}>
                  Configure a basic workspace before connecting integrations.
                </p>
                <div style={{ marginBottom: 18 }}>
                  <Label>Project name</Label>
                  <Input value={projectName} onChange={setProjectName} placeholder="e.g. acme-design-system" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                  <SelectField
                    label="Template"
                    value={template}
                    isOpen={templateOpen}
                    onOpen={() => setTemplateOpen((v) => !v)}
                    options={[
                      "Web App",
                      "Mobile App",
                      "Design System",
                      "SaaS Dashboard",
                      "Admin Panel",
                      "E-commerce Store",
                      "Marketing Site",
                      "Docs + Playground",
                    ]}
                    onPick={(v) => {
                      setTemplate(v);
                      setTemplateOpen(false);
                    }}
                  />
                  <SelectField
                    label="Team size"
                    value={teamSize}
                    isOpen={teamSizeOpen}
                    onOpen={() => setTeamSizeOpen((v) => !v)}
                    options={["Solo", "2-5", "6-15", "16+"]}
                    onPick={(v) => {
                      setTeamSize(v);
                      setTeamSizeOpen(false);
                    }}
                  />
                </div>
                <BtnPrimary onClick={() => onboardingReady && setOnboardingStep("figma")} style={{ width: "100%" }}>
                  Continue
                </BtnPrimary>
              </div>
            )}

            {onboardingStep === "figma" && (
              <div style={{ width: 520 }}>
                <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 8, letterSpacing: "-0.3px", textAlign: "center" }}>Connect Figma</h1>
                <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 26, textAlign: "center" }}>
                  Read-only access only. No writes, no file edits.
                </p>
                <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                  <TogglePill active={figmaMethod === "oauth"} onClick={() => setFigmaMethod("oauth")} label="OAuth" />
                  <TogglePill active={figmaMethod === "url"} onClick={() => setFigmaMethod("url")} label="File URL" />
                </div>
                <Card>
                  {figmaMethod === "oauth" ? (
                    <>
                      <SelectField
                        label="Workspace file"
                        value={figmaFile}
                        isOpen={figmaFileOpen}
                        onOpen={() => setFigmaFileOpen((v) => !v)}
                        options={["Design System v2.4", "Marketing Kit 2024", "App Foundations"]}
                        onPick={(v) => {
                          setFigmaFile(v);
                          setFigmaFileOpen(false);
                        }}
                      />
                      <BtnPrimary onClick={() => setFigmaConnected(true)} style={{ width: "100%", marginTop: 12 }}>
                        {figmaConnected ? "Connected" : "Authorize with Figma"}
                      </BtnPrimary>
                    </>
                  ) : (
                    <>
                      <Label>File URL</Label>
                      <Input value={figmaUrl} onChange={setFigmaUrl} placeholder="https://figma.com/file/..." />
                    </>
                  )}
                  <p style={{ fontSize: 11, color: "var(--text-4)", marginTop: 14 }}>
                    Permissions: read file metadata, components, and variables only.
                  </p>
                </Card>
                <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                  <BtnGhost onClick={() => setOnboardingStep("project")} style={{ flex: 1, height: 42, fontSize: 13 }}>
                    Back
                  </BtnGhost>
                  <BtnPrimary onClick={() => onboardingReady && setOnboardingStep("github")} style={{ flex: 1 }}>
                    Continue
                  </BtnPrimary>
                </div>
              </div>
            )}

            {onboardingStep === "github" && (
              <div style={{ width: 520 }}>
                <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 8, letterSpacing: "-0.3px", textAlign: "center" }}>Connect GitHub</h1>
                <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 26, textAlign: "center" }}>
                  Select repository and scan behavior. All values are editable later.
                </p>
                <Card>
                  <SelectField
                    label="Repository"
                    value={repo}
                    isOpen={repoOpen}
                    onOpen={() => setRepoOpen((v) => !v)}
                    options={["acme-inc/design-system", "acme-inc/web-app", "acme-inc/admin-ui"]}
                    onPick={(v) => {
                      setRepo(v);
                      setRepoOpen(false);
                    }}
                  />
                  <div style={{ marginTop: 12 }}>
                    <SelectField
                      label="Branch"
                      value={branch}
                      isOpen={branchOpen}
                      onOpen={() => setBranchOpen((v) => !v)}
                      options={["main", "develop", "release/ui"]}
                      onPick={(v) => {
                        setBranch(v);
                        setBranchOpen(false);
                      }}
                    />
                  </div>
                  <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: "var(--text-3)" }}>Monorepo subdirectory</span>
                    <ToggleSwitch active={monorepo} onToggle={() => setMonorepo((v) => !v)} />
                  </div>
                  {monorepo && (
                    <Input value={subdir} onChange={setSubdir} mono style={{ marginTop: 10 }} />
                  )}
                  <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: "var(--text-3)" }}>PR-triggered scans</span>
                    <ToggleSwitch active={scanOnPR} onToggle={() => setScanOnPR((v) => !v)} />
                  </div>
                </Card>
                <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                  <BtnGhost onClick={() => setOnboardingStep("figma")} style={{ flex: 1, height: 42, fontSize: 13 }}>
                    Back
                  </BtnGhost>
                  <BtnPrimary onClick={() => onboardingReady && setOnboardingStep("scanning")} style={{ flex: 1 }}>
                    Connect & Start Scan
                  </BtnPrimary>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  const currentFinding = findings[selectedFinding];

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", background: "var(--bg)" }}>
      <Sidebar
        active={activeSection}
        onNavigate={(item) => setActiveSection(item as Section)}
        onLogout={() => setShowLogoutConfirm(true)}
      />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <Topbar
          breadcrumb={[projectName || "acme-design-system", activeSection]}
          actions={
            <>
              {activeSection === "Scans" && (
                <>
                  <BtnGhost>Export</BtnGhost>
                  <BtnGhost onClick={() => setShowShare(true)} style={{ borderColor: "var(--accent-border)", color: "var(--accent)" }}>
                    Share Report
                  </BtnGhost>
                </>
              )}
              {activeSection === "Settings" && (
                <BtnGhost onClick={() => setActiveSection("Billing")} style={{ borderColor: "var(--accent-border)", color: "var(--accent)" }}>
                  Open billing
                </BtnGhost>
              )}
            </>
          }
        />

        <div style={{ flex: 1, overflowY: "auto", padding: 26 }}>
          {activeSection === "Overview" && (
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>Workspace overview</h1>
              <p style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 20 }}>
                High-level status of drift, scan health, and team activity.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 14, marginBottom: 22 }}>
                <MetricCard label="Activation (24h)" value="66%" />
                <MetricCard label="Second scan within 7d" value="54%" />
                <MetricCard label="Median time to value" value="11m" accent />
              </div>
              <Card style={{ marginBottom: 22, padding: 18 }}>
                <SectionTitle title="Weekly scan throughput (last 6 weeks)" />
                <Bars values={[8, 9, 11, 10, 12, 11]} labels={["W1", "W2", "W3", "W4", "W5", "W6"]} compact />
                <p style={{ marginTop: 10, fontSize: 11, color: "var(--text-4)" }}>
                  Stable cadence with low volatility. Scheduled weekly scans drive baseline usage across active repos.
                </p>
              </Card>
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14, marginBottom: 22 }}>
                <Card style={{ padding: 18 }}>
                  <SectionTitle title="Activation funnel (modeled private beta)" />
                  {[
                    { label: "Workspace created", value: 100, count: "~86 users" },
                    { label: "Figma connected", value: 76, count: "~65 users" },
                    { label: "GitHub connected", value: 64, count: "~55 users" },
                    { label: "First scan in 24h", value: 66, count: "~57 users" },
                    { label: "Finding decision taken", value: 54, count: "~46 users" },
                  ].map((stage) => (
                    <div key={stage.label} style={{ borderTop: "1px solid var(--surface-raised)", padding: "12px 0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: "var(--text-2)" }}>{stage.label}</span>
                        <span style={{ fontSize: 11, color: "var(--text-4)" }}>{stage.count}</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 4, background: "var(--surface-raised)", overflow: "hidden", border: "1px solid var(--border)" }}>
                        <div style={{ width: `${stage.value}%`, height: "100%", background: "var(--accent)" }} />
                      </div>
                    </div>
                  ))}
                </Card>
                <Card style={{ padding: 18 }}>
                  <SectionTitle title="Quality and reliability" />
                  <Row left="Figma sync success rate" right="~98%" />
                  <Row left="GitHub check delivery rate" right="~95%" />
                  <Row left="False positive dismiss rate" right="~19%" />
                  <Row left="Median scan runtime" right="~47s" />
                </Card>
              </div>
              <Card style={{ padding: 18 }}>
                <SectionTitle title="Operational highlights" />
                <Row left="Highest drift repository" right="acme-inc/admin-ui" />
                <Row left="Most affected category" right="Color tokens" />
                <Row left="Top remediation opportunity" right="Primary blue alias normalization" />
                <Row left="Current rollout posture" right="Non-blocking checks, weekly digest enabled" />
              </Card>
            </div>
          )}

          {activeSection === "Scans" && (
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>Latest scan report</h1>
              <p style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 18 }}>Scan #19 · Mar 2024 · Figma + GitHub · {repo}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 10, marginBottom: 16 }}>
                <MetricCard label="Total findings" value="12" />
                <MetricCard label="High severity" value="3" accent />
                <MetricCard label="Components affected" value="8" />
                <MetricCard label="Avg confidence" value="84%" />
              </div>
              <Card>
                <SectionTitle title="Findings" />
                <div style={{ display: "grid", gridTemplateColumns: "180px 90px 90px 90px 1fr 80px", gap: 8, paddingBottom: 8, borderBottom: "1px solid var(--border)" }}>
                  {["Component", "Type", "Severity", "Confidence", "Description", ""].map((h) => (
                    <span key={h} style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.6px", color: "var(--text-4)" }}>
                      {h}
                    </span>
                  ))}
                </div>
                {findings.map((item, idx) => (
                  <button
                    key={`${item.component}-${idx}`}
                    onClick={() => {
                      setSelectedFinding(idx);
                      setFindingAction(null);
                      setShowFindingDrawer(true);
                    }}
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      borderBottom: "1px solid var(--surface-raised)",
                      textAlign: "left",
                      padding: "12px 0",
                      display: "grid",
                      gridTemplateColumns: "180px 90px 90px 90px 1fr 80px",
                      gap: 8,
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ fontSize: 13, color: "var(--text-2)" }}>{item.component}</span>
                    <span style={{ fontSize: 12, color: "var(--text-3)" }}>{item.type}</span>
                    <span style={{ fontSize: 12, color: item.severity === "High" ? "var(--accent)" : "var(--text-3)" }}>{item.severity}</span>
                    <span style={{ fontSize: 12, color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>{item.confidence}%</span>
                    <span style={{ fontSize: 12, color: "var(--text-4)" }}>{item.desc}</span>
                    <span style={{ fontSize: 10, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "right" }}>
                      Review →
                    </span>
                  </button>
                ))}
              </Card>
            </div>
          )}

          {activeSection === "Tokens" && (
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>Token parity map</h1>
              <p style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 16 }}>
                Compare design variables against implementation references.
              </p>
              <div style={{ width: 220, marginBottom: 14 }}>
                <SelectField
                  label="Filter"
                  value={tokenFilter}
                    isOpen={tokenFilterOpen}
                    onOpen={() => setTokenFilterOpen((v) => !v)}
                    options={["All", "Color", "Spacing", "Typography"]}
                    onPick={(v) => {
                      setTokenFilter(v);
                      setTokenFilterOpen(false);
                    }}
                  compact
                />
              </div>
              <Card>
                <SectionTitle title={`Showing: ${tokenFilter}`} />
                {[
                  ["color.primary.600", "#1D4ED8", "#2563EB", "Mismatch"],
                  ["space.5", "20px", "16px", "Mismatch"],
                  ["font.weight.medium", "500", "500", "Aligned"],
                  ["radius.md", "8px", "8px", "Aligned"],
                ].map((row) => (
                  <div key={row[0]} style={{ display: "grid", gridTemplateColumns: "1.2fr 0.6fr 0.6fr 0.5fr", gap: 8, borderTop: "1px solid var(--surface-raised)", padding: "10px 0" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-2)" }}>{row[0]}</span>
                    <span style={{ fontSize: 12, color: "var(--text-3)" }}>{row[1]}</span>
                    <span style={{ fontSize: 12, color: "var(--text-3)" }}>{row[2]}</span>
                    <span style={{ fontSize: 11, color: row[3] === "Mismatch" ? "var(--accent)" : "var(--text-3)" }}>{row[3]}</span>
                  </div>
                ))}
              </Card>
            </div>
          )}

          {activeSection === "Insights" && (
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>AI insights</h1>
              <p style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 18 }}>
                Trend-level quality indicators and confidence movement.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 14, marginBottom: 20 }}>
                <MetricCard label="Predicted drift (next scan)" value="~8" />
                <MetricCard label="Model confidence" value="~86%" />
                <MetricCard label="Regression risk" value="Medium" accent />
              </div>

              <Card style={{ padding: 18, marginBottom: 20 }}>
                <SectionTitle title="Design drift trend (last 6 scans)" />
                <Bars values={[12, 10, 9, 11, 7, 6]} labels={["Feb 05", "Feb 12", "Feb 19", "Feb 26", "Mar 04", "Mar 11"]} compact />
                <p style={{ marginTop: 10, fontSize: 11, color: "var(--text-4)" }}>
                  Drift is trending down overall, with one temporary spike in late February.
                </p>
              </Card>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Card style={{ padding: 18 }}>
                  <SectionTitle title="Current risk snapshot" />
                  <SeverityBar high={3} medium={5} low={4} />
                  <div style={{ marginTop: 10 }}>
                    <Row left="High severity findings" right="3" />
                    <Row left="Top affected area" right="Color tokens" />
                    <Row left="Most drifted repo" right="acme-inc/admin-ui" />
                  </div>
                </Card>
                <Card style={{ padding: 18 }}>
                  <SectionTitle title="Priority actions" />
                  <Row left="Normalize primary blue alias" right="High" />
                  <Row left="Enforce spacing token on Card" right="Medium" />
                  <Row left="Keep PR checks enabled on web-app" right="Operational" />
                </Card>
              </div>
            </div>
          )}

          {activeSection === "Team" && (
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>Team access</h1>
              <p style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 18 }}>
                Invite collaborators and define responsibilities.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Card>
                  <SectionTitle title="Members" />
                  <Row left="Abi Marangoni · Owner" right="Active" />
                  <Row left="Lucas Lopez · Engineer" right="Active" />
                  <Row left="Nadia Kim · Designer" right="Pending" />
                </Card>
                <Card>
                  <SectionTitle title="Invite user" />
                  <Label>Email</Label>
                  <Input value={inviteEmail} onChange={setInviteEmail} placeholder="name@company.com" style={{ marginBottom: 10 }} />
                  <SelectField
                    label="Role"
                    value={role}
                    isOpen={roleOpen}
                    onOpen={() => setRoleOpen((v) => !v)}
                    options={["Viewer", "Editor", "Admin"]}
                    onPick={(v) => {
                      setRole(v);
                      setRoleOpen(false);
                    }}
                    compact
                  />
                  <BtnPrimary onClick={runInvite} style={{ width: "100%", marginTop: 12 }}>
                    Send invite
                  </BtnPrimary>
                  {inviteStatus && <p style={{ marginTop: 10, fontSize: 11, color: "var(--text-3)" }}>{inviteStatus}</p>}
                </Card>
              </div>
            </div>
          )}

          {activeSection === "Settings" && (
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>Workspace settings</h1>
              <p style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 16 }}>
                Manage identity, integrations, and governance defaults.
              </p>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {(["Integrations", "Profile"] as SettingsTab[]).map((tab) => (
                  <SegmentedTabButton
                    key={tab}
                    label={tab}
                    active={settingsTab === tab}
                    onClick={() => setSettingsTab(tab)}
                  />
                ))}
              </div>
              <Card>
                {settingsTab === "Profile" && (
                  <>
                    <SectionTitle title="Profile" />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div>
                        <Label>Workspace name</Label>
                        <Input value={profileWorkspaceName} onChange={setProfileWorkspaceName} />
                      </div>
                      <SelectField
                        label="Default source of truth"
                        value={profileSource}
                        isOpen={profileSourceOpen}
                        onOpen={() => setProfileSourceOpen((v) => !v)}
                        options={["Design wins", "Code wins", "Ask on conflict"]}
                        onPick={(v) => {
                          setProfileSource(v);
                          setProfileSourceOpen(false);
                        }}
                      />
                    </div>
                    <div style={{ marginTop: 12, borderTop: "1px solid var(--surface-raised)", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: "var(--text-2)" }}>Weekly digest notifications</span>
                      <ToggleSwitch active={profileWeeklyDigest} onToggle={() => setProfileWeeklyDigest((v) => !v)} />
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <BtnGhost
                        style={{ height: 42, fontSize: 13 }}
                        onClick={() => {
                          setProfileWorkspaceName(projectName || "hools");
                          setProfileSource("Design wins");
                          setProfileWeeklyDigest(true);
                          setProfileSaved("Profile reset.");
                        }}
                      >
                        Reset
                      </BtnGhost>
                      <BtnPrimary
                        style={{ height: 42, fontSize: 13 }}
                        onClick={() => {
                          const next = profileWorkspaceName.trim() || "hools";
                          setProfileWorkspaceName(next);
                          setProjectName(next);
                          setProfileSaved("Profile settings saved.");
                        }}
                      >
                        Save changes
                      </BtnPrimary>
                    </div>
                    {profileSaved && <p style={{ marginTop: 8, fontSize: 11, color: "var(--text-3)" }}>{profileSaved}</p>}
                  </>
                )}
                {settingsTab === "Integrations" && (
                  <>
                    <SectionTitle title="Integrations" />
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <IntegrationRow
                        name="Figma"
                        subtitle={figmaConnected ? `${figmaFile} · read-only access` : "No file connected"}
                        connected={figmaConnected}
                        enabled={figmaConnected}
                        onToggle={() => setFigmaConnected((v) => !v)}
                        toggleLabel="Connection"
                      />
                      <IntegrationRow
                        name="GitHub"
                        subtitle={githubConnected ? `${repo} · ${branch}` : "No repository connected"}
                        connected={githubConnected}
                        enabled={githubConnected}
                        onToggle={() => setGithubConnected((v) => !v)}
                        toggleLabel="Connection"
                      />
                      <IntegrationRow
                        name="Slack"
                        subtitle={slackConnected ? "#design-system-alerts" : "Not connected"}
                        connected={slackConnected}
                        enabled={slackDigestEnabled}
                        onToggle={() => setSlackDigestEnabled((v) => !v)}
                        toggleLabel="Weekly digest"
                        toggleDisabled={!slackConnected}
                      />
                      <IntegrationRow
                        name="Vercel"
                        subtitle={vercelConnected ? "Preview checks + deployment context" : "Not connected"}
                        connected={vercelConnected}
                        enabled={vercelPreviewEnabled}
                        onToggle={() => setVercelPreviewEnabled((v) => !v)}
                        toggleLabel="Preview checks"
                        toggleDisabled={!vercelConnected}
                      />
                      <IntegrationRow
                        name="Jira"
                        subtitle={jiraConnected ? "Issue sync for high severity findings" : "Not connected"}
                        connected={jiraConnected}
                        enabled={jiraSyncEnabled}
                        onToggle={() => setJiraSyncEnabled((v) => !v)}
                        toggleLabel="Issue sync"
                        toggleDisabled={!jiraConnected}
                      />
                      <IntegrationRow
                        name="PR checks"
                        subtitle={githubConnected ? "Comment summary on pull requests" : "Requires GitHub"}
                        connected={githubConnected}
                        enabled={scanOnPR}
                        onToggle={() => setScanOnPR((v) => !v)}
                        toggleLabel="Auto post"
                        toggleDisabled={!githubConnected}
                      />
                    </div>
                  </>
                )}
              </Card>
            </div>
          )}

          {activeSection === "Billing" && (
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>Billing</h1>
              <p style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 16 }}>
                Manage plan, usage limits, and payment-related settings.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12, marginBottom: 12 }}>
                <MetricCard label="Current plan" value={currentPlan} />
                <MetricCard label="Scans used" value={currentPlan === "Free" ? "3 / 3" : "12 / unlimited"} accent />
                <MetricCard label="Recommended" value={currentPlan === "Free" ? "Pro" : "Team"} />
              </div>
              {billingNotice && (
                <Card style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: 12, color: "var(--text-2)" }}>{billingNotice}</p>
                </Card>
              )}
              <Card style={{ marginBottom: 12 }}>
                <SectionTitle title="Plan details" />
                <Row left="Current plan" right={currentPlan} />
                <Row left="Included scans" right={currentPlan === "Free" ? "3 / month" : "Unlimited"} />
                <Row left="Current usage cycle" right="Mar 1 - Mar 31" />
                <Row left="Upgrade recommendation" right={currentPlan === "Free" ? "Pro · $29 / month" : "Team · $19 / user"} />
                <Row left="Invoice email" right="abi@company.com" />
              </Card>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12 }}>
                <BillingPlanCard
                  name="Free"
                  price="$0"
                  subtitle="1 project · 3 scans/month"
                  currentPlan={currentPlan}
                  current={currentPlan === "Free"}
                  onSelect={() => setUpgradeTarget("Free")}
                />
                <BillingPlanCard
                  name="Pro"
                  price="$29"
                  subtitle="5 projects · unlimited scans"
                  currentPlan={currentPlan}
                  current={currentPlan === "Pro"}
                  highlighted
                  onSelect={() => setUpgradeTarget("Pro")}
                />
                <BillingPlanCard
                  name="Team"
                  price="$19"
                  subtitle="per user · shared governance"
                  currentPlan={currentPlan}
                  current={currentPlan === "Team"}
                  onSelect={() => setUpgradeTarget("Team")}
                />
                <BillingPlanCard
                  name="Enterprise"
                  price="Custom"
                  subtitle="SSO · SLA · dedicated support"
                  currentPlan={currentPlan}
                  current={currentPlan === "Enterprise"}
                  onSelect={() => setUpgradeTarget("Enterprise")}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {showShare && (
        <Overlay onClick={() => setShowShare(false)}>
          <div style={{ width: 460, borderRadius: "var(--radius-xl)", border: "1px solid var(--border)", background: "var(--surface)", padding: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 6 }}>Share report</h2>
            <p style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 16 }}>Read-only external report link</p>
            <Input value="https://synclayer.app/r/scan-19-8fd2" onChange={() => {}} mono />
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <BtnGhost style={{ flex: 1, height: 42, fontSize: 13 }}>Copy link</BtnGhost>
              <BtnPrimary style={{ flex: 1 }} onClick={() => setShowShare(false)}>
                Done
              </BtnPrimary>
            </div>
          </div>
        </Overlay>
      )}

      {showFindingDrawer && (
        <Overlay onClick={() => setShowFindingDrawer(false)}>
          <div style={{ width: 680, borderRadius: "var(--radius-xl)", border: "1px solid var(--border)", background: "var(--surface)", padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                <p style={{ fontSize: 11, color: "var(--text-4)", marginBottom: 4 }}>Finding detail</p>
                <h3 style={{ fontSize: 16, fontWeight: 500 }}>
                  {currentFinding.type} mismatch in {currentFinding.component}
                </h3>
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-3)" }}>{currentFinding.confidence}% confidence</span>
            </div>
            <Card>
              <p style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 10 }}>{currentFinding.desc}</p>
              <p style={{ fontSize: 11, color: "var(--text-4)" }}>
                Suggested resolution: align code token with design source or mark project override with rationale.
              </p>
            </Card>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <DecisionBtn label="Design wins" active={findingAction === "design"} onClick={() => setFindingAction("design")} />
              <DecisionBtn label="Code wins" active={findingAction === "code"} onClick={() => setFindingAction("code")} />
              <DecisionBtn label="Dismiss" active={findingAction === "dismiss"} onClick={() => setFindingAction("dismiss")} />
              <BtnGhost onClick={() => setShowFindingDrawer(false)} style={{ marginLeft: "auto" }}>
                Close
              </BtnGhost>
            </div>
          </div>
        </Overlay>
      )}

      {showLogoutConfirm && (
        <Overlay onClick={() => setShowLogoutConfirm(false)}>
          <div style={{ width: 360, borderRadius: "var(--radius-xl)", border: "1px solid var(--border)", background: "var(--surface)", padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 6 }}>Log out</h3>
            <p style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 14 }}>
              End this session and return to onboarding flow.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <BtnGhost onClick={() => setShowLogoutConfirm(false)} style={{ flex: 1, height: 42, fontSize: 13 }}>
                Cancel
              </BtnGhost>
              <BtnPrimary
                onClick={() => {
                  setShowLogoutConfirm(false);
                  resetSession();
                }}
                style={{ flex: 1 }}
              >
                Log out
              </BtnPrimary>
            </div>
          </div>
        </Overlay>
      )}

      {upgradeTarget && (
        <Overlay onClick={() => setUpgradeTarget(null)}>
          <div style={{ width: 420, borderRadius: "var(--radius-xl)", border: "1px solid var(--border)", background: "var(--surface)", padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 6 }}>Confirm plan change</h3>
            <p style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 14 }}>
              Switch workspace plan to <span style={{ color: "var(--accent)" }}>{upgradeTarget}</span>?
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <BtnGhost onClick={() => setUpgradeTarget(null)} style={{ flex: 1, height: 42, fontSize: 13 }}>
                Cancel
              </BtnGhost>
              <BtnPrimary
                onClick={() => {
                  setCurrentPlan(upgradeTarget);
                  setBillingNotice(`Plan updated successfully: ${upgradeTarget}.`);
                  setUpgradeTarget(null);
                }}
                style={{ flex: 1, height: 42, fontSize: 13 }}
              >
                Confirm upgrade
              </BtnPrimary>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        background: "var(--surface)",
        padding: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.7px", color: "var(--text-4)", marginBottom: 8 }}>{title}</p>;
}

function MetricCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <Card>
      <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.6px", color: "var(--text-4)", marginBottom: 8 }}>{label}</p>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 24, color: accent ? "var(--accent)" : "var(--text-1)" }}>{value}</p>
    </Card>
  );
}

function Row({ left, right }: { left: string; right: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, borderTop: "1px solid var(--surface-raised)", padding: "10px 0" }}>
      <span style={{ fontSize: 12, color: "var(--text-2)" }}>{left}</span>
      <span style={{ fontSize: 11, color: "var(--text-4)" }}>{right}</span>
    </div>
  );
}

function IntegrationRow({
  name,
  subtitle,
  connected,
  enabled,
  onToggle,
  toggleLabel,
  toggleDisabled,
}: {
  name: string;
  subtitle: string;
  connected: boolean;
  enabled: boolean;
  onToggle: () => void;
  toggleLabel: string;
  toggleDisabled?: boolean;
}) {
  return (
    <div
      style={{
        border: "1px solid var(--surface-raised)",
        borderRadius: "var(--radius-md)",
        padding: "11px 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "var(--text-2)", fontWeight: 500 }}>{name}</span>
          <span
            style={{
              fontSize: 9,
              textTransform: "uppercase",
              letterSpacing: "0.6px",
              borderRadius: 999,
              padding: "2px 8px",
              border: `1px solid ${connected ? "var(--accent-border)" : "var(--border)"}`,
              background: connected ? "var(--accent-dim)" : "transparent",
              color: connected ? "var(--accent)" : "var(--text-4)",
            }}
          >
            {connected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <p style={{ fontSize: 11, color: connected ? "var(--text-3)" : "var(--text-4)", marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {subtitle}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <span style={{ fontSize: 10, color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{toggleLabel}</span>
        <ToggleSwitch active={enabled} onToggle={onToggle} disabled={toggleDisabled} />
      </div>
    </div>
  );
}

function ToggleSwitch({ active, onToggle, disabled }: { active: boolean; onToggle: () => void; disabled?: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={disabled}
      style={{
        width: 34,
        height: 18,
        borderRadius: 10,
        border: `1px solid ${active ? "var(--accent-border)" : hovered ? "var(--border-strong)" : "var(--border)"}`,
        background: active ? "var(--accent-dim)" : hovered ? "var(--surface-raised)" : "transparent",
        position: "relative",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: active ? "var(--accent)" : "var(--text-4)",
          position: "absolute",
          top: 3,
          left: active ? 18 : 4,
        }}
      />
    </button>
  );
}

function TogglePill({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: 30,
        padding: "0 12px",
        borderRadius: "var(--radius-sm)",
        border: `1px solid ${active ? "var(--accent-border)" : hovered ? "var(--border-strong)" : "var(--border)"}`,
        background: active ? "var(--accent-dim)" : hovered ? "var(--surface-raised)" : "transparent",
        color: active ? "var(--accent)" : hovered ? "var(--text-2)" : "var(--text-3)",
        fontSize: 11,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function Bars({ values, labels, compact }: { values: number[]; labels?: string[]; compact?: boolean }) {
  const max = Math.max(...values);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: compact ? 120 : 160, marginTop: 8 }}>
      {values.map((value, idx) => (
        <div key={`${value}-${idx}`} style={{ flex: 1 }}>
          <div
            style={{
              height: `${(value / max) * 100}%`,
              minHeight: 8,
              borderRadius: "3px 3px 0 0",
              background: idx === values.length - 1 ? "var(--accent)" : "var(--surface-raised)",
              border: "1px solid var(--border)",
            }}
          />
          <p style={{ fontSize: 10, color: "var(--text-4)", textAlign: "center", marginTop: 4 }}>
            {labels?.[idx] ?? `S${idx + 1}`}
          </p>
        </div>
      ))}
    </div>
  );
}

function SeverityBar({ high, medium, low }: { high: number; medium: number; low: number }) {
  const total = high + medium + low || 1;
  const highPct = (high / total) * 100;
  const mediumPct = (medium / total) * 100;
  const lowPct = 100 - highPct - mediumPct;
  return (
    <div style={{ width: "100%", height: 10, borderRadius: 6, border: "1px solid var(--border)", overflow: "hidden", display: "flex" }}>
      <div style={{ width: `${highPct}%`, background: "var(--accent)" }} />
      <div style={{ width: `${mediumPct}%`, background: "var(--text-3)" }} />
      <div style={{ width: `${lowPct}%`, background: "var(--surface-raised)" }} />
    </div>
  );
}

function DecisionBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: 36,
        padding: "0 14px",
        borderRadius: "var(--radius-sm)",
        border: `1px solid ${active ? "var(--accent-border)" : hovered ? "var(--border-strong)" : "var(--border)"}`,
        background: active ? "var(--accent-dim)" : hovered ? "var(--surface-raised)" : "transparent",
        color: active ? "var(--accent)" : hovered ? "var(--text-2)" : "var(--text-3)",
        fontSize: 11,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function SelectField({
  label,
  value,
  isOpen,
  onOpen,
  options,
  onPick,
  compact,
}: {
  label: string;
  value: string;
  isOpen: boolean;
  onOpen: () => void;
  options: string[];
  onPick: (v: string) => void;
  compact?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <Label>{label}</Label>
      <button
        onClick={onOpen}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "100%",
          height: compact ? 36 : 42,
          borderRadius: "var(--radius-md)",
          border: `1px solid ${isOpen ? "var(--accent-border)" : hovered ? "var(--border-strong)" : "var(--border)"}`,
          background: hovered || isOpen ? "var(--surface-raised)" : "var(--surface)",
          color: isOpen || hovered ? "var(--text-1)" : "var(--text-2)",
          padding: "0 12px",
          fontSize: compact ? 12 : 13,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          transition: "background-color 160ms ease, border-color 160ms ease, color 160ms ease",
        }}
      >
        <span>{value}</span>
        <span
          style={{
            color: "var(--text-4)",
            fontSize: 11,
            fontWeight: 500,
            lineHeight: 1,
          }}
        >
          {isOpen ? "⌃" : "⌄"}
        </span>
      </button>
      {isOpen && options.length > 0 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: compact ? 62 : 68,
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            zIndex: 20,
            overflow: "hidden",
          }}
        >
          {options.map((option) => (
            <SelectOption key={option} option={option} isActive={option === value} onPick={onPick} />
          ))}
        </div>
      )}
    </div>
  );
}

function SelectOption({
  option,
  isActive,
  onPick,
}: {
  option: string;
  isActive: boolean;
  onPick: (v: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={() => onPick(option)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        height: 34,
        border: "none",
        borderTop: "1px solid var(--surface-raised)",
        background: isActive ? "var(--accent-dim)" : hovered ? "var(--surface-raised)" : "transparent",
        textAlign: "left",
        padding: "0 12px",
        color: isActive ? "var(--accent)" : hovered ? "var(--text-1)" : "var(--text-2)",
        fontSize: 12,
        cursor: "pointer",
        transition: "background-color 140ms ease, color 140ms ease",
      }}
    >
      {option}
    </button>
  );
}

function SegmentedTabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: 30,
        padding: "0 12px",
        borderRadius: "var(--radius-sm)",
        border: `1px solid ${active ? "var(--accent-border)" : hovered ? "var(--border-strong)" : "var(--border)"}`,
        background: active ? "var(--accent-dim)" : hovered ? "var(--surface-raised)" : "transparent",
        color: active ? "var(--accent)" : hovered ? "var(--text-2)" : "var(--text-3)",
        fontSize: 11,
        cursor: "pointer",
        transition: "background-color 140ms ease, border-color 140ms ease, color 140ms ease",
      }}
    >
      {label}
    </button>
  );
}

function BillingPlanCard({
  name,
  price,
  subtitle,
  currentPlan,
  current,
  highlighted,
  onSelect,
}: {
  name: PlanTier;
  price: string;
  subtitle: string;
  currentPlan: PlanTier;
  current?: boolean;
  highlighted?: boolean;
  onSelect: () => void;
}) {
  const rank: Record<PlanTier, number> = { Free: 0, Pro: 1, Team: 2, Enterprise: 3 };
  let cta = "";
  if (current) cta = "Current plan";
  else if (name === "Enterprise") cta = "Contact sales";
  else if (rank[name] > rank[currentPlan]) cta = `Upgrade to ${name}`;
  else cta = `Downgrade to ${name}`;

  return (
    <div
      style={{
        border: `1px solid ${highlighted ? "var(--accent-border)" : "var(--border)"}`,
        borderRadius: "var(--radius-lg)",
        background: "var(--surface)",
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div>
        <p style={{ fontSize: 12, color: highlighted ? "var(--accent)" : "var(--text-2)", fontWeight: 500 }}>{name}</p>
        <p style={{ fontSize: 20, color: "var(--text-1)", fontFamily: "var(--font-mono)", marginTop: 2 }}>{price}</p>
        <p style={{ fontSize: 10, color: "var(--text-4)", marginTop: 4 }}>{subtitle}</p>
      </div>
      <BtnGhost
        onClick={() => {
          if (!current) onSelect();
        }}
        style={{
          width: "100%",
          height: 38,
          fontSize: 12,
          borderColor: highlighted ? "var(--accent-border)" : current ? "var(--border-strong)" : "var(--border-strong)",
          background: highlighted ? "var(--accent-dim)" : "var(--surface-raised)",
          color: highlighted ? "var(--accent)" : current ? "var(--text-2)" : "var(--text-1)",
          opacity: current ? 0.85 : 1,
        }}
      >
        {cta}
      </BtnGhost>
    </div>
  );
}
