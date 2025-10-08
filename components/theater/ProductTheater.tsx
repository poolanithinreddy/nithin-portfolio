"use client";

import { useState, useEffect } from "react";
import MacWindow from "@/components/chrome/MacWindow";
import { Activity, Code2, TrendingUp } from "lucide-react";

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: "overview", label: "Overview", icon: <Activity className="w-4 h-4" /> },
  { id: "architecture", label: "Architecture", icon: <Code2 className="w-4 h-4" /> },
  { id: "outcome", label: "Outcome", icon: <TrendingUp className="w-4 h-4" /> },
];

interface ProductTheaterProps {
  project: {
    title: string;
    slug: string;
    summary: string;
  };
}

export function ProductTheater({ project }: ProductTheaterProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "✓ vCenter connection established",
    "✓ VM template cloned successfully",
    "✓ Network policies applied",
  ]);

  // Simulate live provisioning feed
  useEffect(() => {
    const logs = [
      "✓ SAML SSO: Role mapping complete",
      "✓ VM instance provisioned: lab-cyber-501-vm12",
      "✓ SSH jump-host policy activated",
      "✓ Post-provision script executed",
      "✓ Audit log written: PROVISION_SUCCESS",
      "✓ Student access granted: <1min onboarding",
    ];

    const interval = setInterval(() => {
      setTerminalLines(prev => {
        const next = [...prev];
        next.push(logs[Math.floor(Math.random() * logs.length)]);
        return next.slice(-5);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 p-1 glass-card rounded-2xl w-fit mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <MacWindow
        title={project.title}
        footer={
          <div className="flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
            <span className="flex items-center gap-1.5">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Production
            </span>
            <span>•</span>
            <span>100+ VMs/week</span>
            <span>•</span>
            <span>FERPA Compliant</span>
            <span>•</span>
            <span>SSO &lt; 1min</span>
          </div>
        }
      >
        <div className="p-8 min-h-[500px]">
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div>
                <h3 className="text-2xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">
                  CyberRange Portal — End-to-End Platform for Cybersecurity Labs
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Production system that provisions isolated virtual lab environments for UMBC cybersecurity courses. 
                  Delivers full-stack workflows—class and exercise management, automated VM lifecycle, SSO integration, 
                  and operational visibility—so instructors can teach securely at scale while students get reliable, 
                  &ldquo;just-works&rdquo; lab instances.
                </p>
              </div>

              {/* Problem & Goals */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                  <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3">❌ Before</div>
                  <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                    <li>• Manual VM setup taking hours per lab</li>
                    <li>• Inconsistent access controls</li>
                    <li>• Support requests spike at semester start</li>
                    <li>• Error-prone provisioning scripts</li>
                  </ul>
                </div>
                
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
                  <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-3">✅ Goals</div>
                  <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                    <li>• One-click class provisioning/teardown</li>
                    <li>• Least-privilege with audit trails</li>
                    <li>• Self-serve status for TAs</li>
                    <li>• Production-grade (TLS, observability)</li>
                  </ul>
                </div>
              </div>

              {/* My Role */}
              <div className="p-5 rounded-xl glass-card">
                <h4 className="font-bold mb-4 text-neutral-900 dark:text-neutral-100">My Role: Full-Stack + Platform Owner</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">Frontend:</span>
                      <span className="text-neutral-600 dark:text-neutral-400 ml-2">React/Next.js dashboards, role-aware UX, validation</span>
                    </div>
                    <div>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">Backend:</span>
                      <span className="text-neutral-600 dark:text-neutral-400 ml-2">Node/Express APIs, RBAC, audit trails, workers</span>
                    </div>
                    <div>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">Auth:</span>
                      <span className="text-neutral-600 dark:text-neutral-400 ml-2">SAML SSO, secure cookies, CSRF hardening</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">Automation:</span>
                      <span className="text-neutral-600 dark:text-neutral-400 ml-2">vCenter lifecycle, golden templates, SSH policies</span>
                    </div>
                    <div>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">Ops:</span>
                      <span className="text-neutral-600 dark:text-neutral-400 ml-2">Docker/Compose, NGINX, health checks, metrics</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Live Provisioning Feed */}
              <div className="mt-6 rounded-xl bg-neutral-950 dark:bg-neutral-900 p-4 font-mono text-sm">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neutral-800">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-neutral-500 text-xs">provisioning.log</span>
                </div>
                <div className="space-y-1">
                  {terminalLines.map((line, i) => (
                    <div key={i} className="text-emerald-400 animate-in slide-in-from-left duration-300">
                      {line}
                    </div>
                  ))}
                  <div className="flex items-center gap-2 text-neutral-600">
                    <span className="animate-pulse">▋</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "architecture" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">System Architecture</h3>
              
              {/* Architecture Diagram */}
              <div className="relative p-6 rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
                <div className="space-y-4">
                  {/* Client Layer */}
                  <div className="flex items-center justify-center">
                    <div className="glass-card p-4 rounded-xl text-center min-w-[200px] border-2 border-blue-500/30">
                      <div className="text-3xl mb-2">🖥️</div>
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100">Next.js UI</div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">Role-aware dashboards</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="text-2xl text-neutral-400">↓ HTTPS/TLS</div>
                  </div>

                  {/* Edge Layer */}
                  <div className="flex items-center justify-center">
                    <div className="glass-card p-4 rounded-xl text-center min-w-[200px] border-2 border-purple-500/30">
                      <div className="text-3xl mb-2">🛡️</div>
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100">NGINX Reverse Proxy</div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">TLS, health checks, caching</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="text-2xl text-neutral-400">↓ REST/RPC</div>
                  </div>

                  {/* API & Workers Layer */}
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <div className="glass-card p-4 rounded-xl text-center min-w-[180px] border-2 border-emerald-500/30">
                      <div className="text-3xl mb-2">⚡</div>
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100">Node/Express API</div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">RBAC, Audit, Jobs</div>
                    </div>
                    <div className="text-2xl text-neutral-400">↔</div>
                    <div className="glass-card p-4 rounded-xl text-center min-w-[180px] border-2 border-orange-500/30">
                      <div className="text-3xl mb-2">🔧</div>
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100">Python/Node Workers</div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">vCenter automation</div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                    <div className="flex flex-col items-center">
                      <div className="text-2xl text-neutral-400 mb-2">↓</div>
                      <div className="glass-card p-4 rounded-xl text-center min-w-[150px]">
                        <div className="text-3xl mb-2">🗄️</div>
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100">MongoDB</div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">Classes, Jobs, Audit</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-2xl text-neutral-400 mb-2">↓</div>
                      <div className="glass-card p-4 rounded-xl text-center min-w-[150px]">
                        <div className="text-3xl mb-2">🐘</div>
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100">PostgreSQL</div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">Users, Instances</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-2xl text-neutral-400 mb-2">↓</div>
                      <div className="glass-card p-4 rounded-xl text-center min-w-[150px]">
                        <div className="text-3xl mb-2">☁️</div>
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100">VMware vCenter</div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">VM Lifecycle</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Flow */}
              <div className="p-5 rounded-xl glass-card">
                <h4 className="font-bold mb-4 text-neutral-900 dark:text-neutral-100">Provisioning Flow (Happy Path)</h4>
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">1</span>
                    <span className="text-neutral-700 dark:text-neutral-300">Instructor creates class & exercise in portal (Next.js UI → Express API)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">2</span>
                    <span className="text-neutral-700 dark:text-neutral-300">SAML SSO maps IdP attributes → RBAC roles; secure session with CSRF protection</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">3</span>
                    <span className="text-neutral-700 dark:text-neutral-300">Instructor clicks &ldquo;Provision&rdquo; → API enqueues job (MongoDB)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">4</span>
                    <span className="text-neutral-700 dark:text-neutral-300">Worker picks job, calls vCenter to clone golden template, applies network policies</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">5</span>
                    <span className="text-neutral-700 dark:text-neutral-300">Worker runs post-provision scripts, registers VM output, applies SSH policies</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">6</span>
                    <span className="text-neutral-700 dark:text-neutral-300">UI polls/streams job updates → real-time status card shows &ldquo;Ready&rdquo;</span>
                  </li>
                </ol>
              </div>

              {/* Tech Stack */}
              <div className="p-5 rounded-xl bg-neutral-100 dark:bg-neutral-900/50">
                <h4 className="font-semibold mb-3 text-sm text-neutral-900 dark:text-neutral-100">Complete Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Next.js", "React", "TypeScript", "Node.js", "Express",
                    "MongoDB", "PostgreSQL", "VMware vCenter", "PowerCLI",
                    "SAML SSO", "Docker", "NGINX", "Python", "Linux", "RBAC"
                  ].map((tech) => (
                    <span key={tech} className="chip text-xs">{tech}</span>
                  ))}
                </div>
              </div>

              {/* Security Model */}
              <div className="p-5 rounded-xl glass-card border-2 border-yellow-500/20">
                <h4 className="font-bold mb-3 text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <span>🔒</span>
                  Security Model
                </h4>
                <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                  <li>✓ <strong>SAML SSO</strong> with UMBC IdP → role mapping (faculty/student/TA/admin)</li>
                  <li>✓ <strong>HttpOnly, Secure cookies</strong> + CSRF protection on mutations</li>
                  <li>✓ <strong>RBAC + Audit trails</strong> — all provisioning events append-only</li>
                  <li>✓ <strong>Network boundaries</strong> — jump-server SSH, restricted shells, credential rotation</li>
                  <li>✓ <strong>Edge hardening</strong> — NGINX TLS, canonical host enforcement</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "outcome" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Impact & Results</h3>
              
              {/* Before/After Metrics */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900">
                  <div className="text-sm font-bold text-red-600 dark:text-red-400 mb-4">❌ Before Portal</div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-700 dark:text-neutral-300">Lab Setup Time:</span>
                      <span className="font-mono font-bold text-red-600 dark:text-red-400">Hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-700 dark:text-neutral-300">SSO Onboarding:</span>
                      <span className="font-mono font-bold text-red-600 dark:text-red-400">Manual</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-700 dark:text-neutral-300">Support Tickets:</span>
                      <span className="font-mono font-bold text-red-600 dark:text-red-400">High</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-700 dark:text-neutral-300">Security Incidents:</span>
                      <span className="font-mono font-bold text-red-600 dark:text-red-400">Variable</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-900">
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-4">✅ After Portal</div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-700 dark:text-neutral-300">Lab Setup Time:</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">Minutes <span className="text-xs">(90% faster)</span></span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-700 dark:text-neutral-300">SSO Onboarding:</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">&lt; 1min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-700 dark:text-neutral-300">Support Tickets:</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">Minimal</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-700 dark:text-neutral-300">PII Incidents:</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">Zero</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl glass-card text-center border-2 border-blue-500/20">
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">100+</div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">VMs Provisioned/Week</div>
                </div>
                <div className="p-5 rounded-xl glass-card text-center border-2 border-emerald-500/20">
                  <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">90%</div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">Faster Lab Setup</div>
                </div>
                <div className="p-5 rounded-xl glass-card text-center border-2 border-purple-500/20">
                  <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">0</div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">PII Incidents</div>
                </div>
              </div>

              {/* Key Achievements */}
              <div className="p-5 rounded-xl glass-card">
                <h4 className="font-bold mb-4 text-neutral-900 dark:text-neutral-100">What I Personally Built</h4>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-sm text-neutral-700 dark:text-neutral-300">
                  <div>✅ Next.js/React dashboards with role-aware UX</div>
                  <div>✅ Express APIs with RBAC & audit trails</div>
                  <div>✅ SAML SSO + secure cookies + CSRF defenses</div>
                  <div>✅ vCenter automation with golden templates</div>
                  <div>✅ Jump-host SSH policies & credential rotation</div>
                  <div>✅ Docker/Compose + NGINX edge deployment</div>
                  <div>✅ Observability: logs, metrics, health checks</div>
                  <div>✅ Runbooks & student guides</div>
                </div>
              </div>

              {/* Impact Summary */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-950/20 dark:to-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-900">
                <h4 className="font-bold mb-4 text-lg text-neutral-900 dark:text-neutral-100">Production Impact</h4>
                <ul className="space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
                  <li className="flex gap-3">
                    <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                    <span><strong>Operationally reliable</strong> provisioning of isolated lab VMs across multiple cybersecurity courses</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                    <span><strong>Reduced manual work</strong> for instructors/IT; faster semester starts with automated workflows</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                    <span><strong>Security posture improved</strong> with SAML SSO, RBAC, CSRF hardening, and credential rotation</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                    <span><strong>Support load decreased</strong> via real-time status, auditability, and comprehensive runbooks</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                    <span><strong>FERPA compliant</strong> with zero PII incidents and complete audit trail</span>
                  </li>
                </ul>
              </div>

              {/* Future Enhancements */}
              <div className="p-5 rounded-xl glass-card border-2 border-blue-500/20">
                <h4 className="font-bold mb-3 text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <span>🚀</span>
                  Future Enhancements
                </h4>
                <div className="grid md:grid-cols-2 gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <div>• Per-lab snapshot/restore</div>
                  <div>• Budget guardrails</div>
                  <div>• Self-service analytics</div>
                  <div>• LMS webhook integration</div>
                  <div>• Worker autoscaling</div>
                  <div>• Student VM self-reset</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </MacWindow>
    </div>
  );
}
