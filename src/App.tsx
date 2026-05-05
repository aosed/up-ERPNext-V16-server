/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Terminal, 
  CheckCircle2, 
  Circle, 
  Copy, 
  Check, 
  Laptop, 
  Database, 
  Globe, 
  Server, 
  Code2, 
  Network,
  Info,
  ChevronLeft,
  Settings2,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CommandSet {
  title: string;
  commands: string[];
}

interface Phase {
  id: number;
  title: string;
  icon: React.ReactNode;
  description: string;
  content: CommandSet[];
}

export default function App() {
  const [activePhase, setActivePhase] = useState(1);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [progress, setProgress] = useState<number[]>([]);

  const phases: Phase[] = [
    {
      id: 1,
      title: "إصلاح الشبكة وتحديث النظام",
      icon: <Network className="w-5 h-5" />,
      description: "تأمين الاتصال بالإنترنت وتحديث المستودعات الأساسية.",
      content: [
        {
          title: "إصلاح DNS وتعطيل الـ CD-ROM وتحديث النظام",
          commands: [
            'echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf',
            "sudo sed -i '/cdrom/s/^/#/' /etc/apt/sources.list",
            "sudo apt update && sudo apt upgrade -y",
            "sudo apt install git curl python3-dev python3-pip python3-venv redis-server mariadb-server mariadb-client software-properties-common -y"
          ]
        }
      ]
    },
    {
      id: 2,
      title: "تثبيت Node.js و Yarn",
      icon: <Code2 className="w-5 h-5" />,
      description: "تحضير بيئة العمل الخاصة بالواجهة الأمامية (Frontend).",
      content: [
        {
          title: "تثبيت Node.js v18 و Yarn",
          commands: [
            "curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -",
            "sudo apt install -y nodejs",
            "sudo npm install -g yarn"
          ]
        }
      ]
    },
    {
      id: 3,
      title: "إعداد قاعدة البيانات (MariaDB)",
      icon: <Database className="w-5 h-5" />,
      description: "تأمين وبرمجة MariaDB لتعمل بتوافق كامل مع ERPNext.",
      content: [
        {
          title: "تأمين MariaDB",
          commands: ["sudo mysql_secure_installation"]
        },
        {
          title: "إضافة إعدادات ERPNext الخاصة",
          commands: [
            'sudo bash -c "cat > /etc/mysql/mariadb.conf.d/50-erpnext.cnf <<EOF\n[server]\nuser = mysql\npid-file = /run/mysqld/mysqld.pid\nsocket = /run/mysqld/mysqld.sock\nbasedir = /usr\ndatadir = /var/lib/mysql\ntmpdir = /tmp\nlc-messages-dir = /usr/share/mysql\nbind-address = 0.0.0.0\n\n[mysqld]\ninnodb-check-optimize-scan = ON\ninnodb-buffer-pool-size = 1G\ninnodb-log-file-size = 256M\ninnodb-file-per-table = 1\ncharacter-set-server = utf8mb4\ncollation-server = utf8mb4_unicode_ci\n\n[mysql]\ndefault-character-set = utf8mb4\nEOF"',
            "sudo systemctl restart mariadb"
          ]
        }
      ]
    },
    {
      id: 4,
      title: "تثبيت Bench و ERPNext V16",
      icon: <Server className="w-5 h-5" />,
      description: "تثبيت الأداة الإدارية وتحميل الإصدار 16 من ERPNext.",
      content: [
        {
          title: "تثبيت Frappe Bench",
          commands: ["sudo pip3 install frappe-bench --break-system-packages"]
        },
        {
          title: "إنشاء مجلد السيرفر وتحميل Frappe",
          commands: ["bench init frappe-bench --frappe-branch version-16", "cd frappe-bench"]
        },
        {
          title: "إنشاء موقع جديد (استبدل site1.local)",
          commands: ["bench new-site site1.local"]
        },
        {
          title: "تحميل وتثبيت تطبيق ERPNext V16",
          commands: [
            "bench get-app erpnext --branch version-16",
            "bench --site site1.local install-app erpnext"
          ]
        }
      ]
    },
    {
      id: 5,
      title: "التشغيل للإنتاج",
      icon: <Globe className="w-5 h-5" />,
      description: "تحويل النظام ليعمل بشكل دائم وسريع كخادم حقيقي.",
      content: [
        {
          title: "إعداد وضع الإنتاج وفتح المنافذ",
          commands: [
            "sudo bench setup production $(whoami)",
            "sudo ufw allow 80/tcp",
            "sudo ufw allow 443/tcp",
            "sudo ufw reload"
          ]
        }
      ]
    },
    {
      id: 6,
      title: "إعدادات اللابتوب",
      icon: <Settings2 className="w-5 h-5" />,
      description: "منع الخمول عند إغلاق الغطاء ومعرفة عنوان الـ IP.",
      content: [
        {
          title: "منع وضع النوم (Sleep) عند إغلاق الغطاء",
          commands: [
            "sudo sed -i 's/#HandleLidSwitch=suspend/HandleLidSwitch=ignore/' /etc/systemd/logind.conf",
            "sudo systemctl restart systemd-logind"
          ]
        },
        {
          title: "معرفة عنوان الـ IP للاتصال",
          commands: ["hostname -I"]
        }
      ]
    }
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleProgress = (id: number) => {
    setProgress(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-sans" dir="rtl">
      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-white border-l border-slate-200 p-6 flex flex-col gap-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Laptop className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">ERPNext V16</h1>
          </div>
          <p className="text-sm text-slate-500 font-medium">دليل التجهيز النهائي للسيرفر</p>
        </div>

        <nav className="flex flex-col gap-2">
          {phases.map((phase) => (
            <button
              key={phase.id}
              onClick={() => setActivePhase(phase.id)}
              className={`flex items-center gap-4 p-3 rounded-xl text-right transition-all duration-200 group ${
                activePhase === phase.id
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className={`p-2 rounded-lg transition-colors ${
                activePhase === phase.id ? 'bg-indigo-100' : 'bg-slate-100 group-hover:bg-slate-200'
              }`}>
                {phase.icon}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-bold truncate">{phase.title}</div>
                {progress.includes(phase.id) && (
                  <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded flex items-center gap-1 w-fit mt-1">
                    <CheckCircle2 className="w-2 h-2" /> مكتمل
                  </span>
                )}
              </div>
              {activePhase === phase.id && (
                <ChevronLeft className="w-4 h-4 mr-auto" />
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="bg-slate-900 rounded-xl p-4 text-white shadow-lg overflow-hidden relative group">
            <div className="relative z-10">
              <h3 className="text-sm font-bold mb-1">التقدم الكلي</h3>
              <div className="text-2xl font-bold mb-2">
                {Math.round((progress.length / phases.length) * 100)}%
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  className="bg-indigo-400 h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(progress.length / phases.length) * 100}%` }}
                />
              </div>
            </div>
            <Server className="absolute -bottom-4 -left-4 w-24 h-24 text-white/5 group-hover:text-white/10 transition-colors" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 max-w-5xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePhase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-slate-200">
              <div>
                <div className="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="bg-indigo-100 px-2 py-0.5 rounded">المرحلة {activePhase}</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                  {phases.find(p => p.id === activePhase)?.title}
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed">
                  {phases.find(p => p.id === activePhase)?.description}
                </p>
              </div>
              <button
                onClick={() => toggleProgress(activePhase)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                  progress.includes(activePhase)
                    ? 'bg-green-100 text-green-700 shadow-sm border border-green-200'
                    : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95'
                }`}
              >
                {progress.includes(activePhase) ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    تم الإكمال
                  </>
                ) : (
                  <>
                    <Circle className="w-5 h-5 " />
                    تحديد كمكتمل
                  </>
                )}
              </button>
            </div>

            <div className="space-y-12">
              {phases.find(p => p.id === activePhase)?.content.map((section, sIdx) => (
                <section key={sIdx}>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-indigo-500" />
                    {section.title}
                  </h3>
                  
                  <div className="space-y-4">
                    {section.commands.map((cmd, cIdx) => (
                      <div 
                        key={cIdx} 
                        className="group relative bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-800">
                          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Command Line Interface</span>
                          <button
                            onClick={() => handleCopy(cmd, `${sIdx}-${cIdx}`)}
                            className="p-1.5 hover:bg-slate-700 rounded transition-colors"
                            title="نسخ الأمر"
                          >
                            {copiedIndex === `${sIdx}-${cIdx}` ? (
                              <Check className="w-3.5 h-3.5 text-green-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </button>
                        </div>
                        <pre className="p-4 overflow-x-auto command-scrollbar">
                          <code className="text-sm font-mono text-indigo-300 leading-relaxed block">
                            <span className="text-slate-500 mr-2 select-none">$</span>
                            {cmd}
                          </code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </section>
              ))}

              {activePhase === 6 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-indigo-50 border border-indigo-200 rounded-2xl p-8 mt-12"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-indigo-900 mb-3">كيف تتصل الأجهزة الأخرى؟</h3>
                      <ul className="space-y-4">
                        <li className="flex items-start gap-3 text-indigo-800">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-200 text-indigo-800 text-xs flex items-center justify-center font-bold mt-0.5">1</span>
                          تأكد أن جميع الأجهزة متصلة بنفس الراوتر.
                        </li>
                        <li className="flex items-start gap-3 text-indigo-800">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-200 text-indigo-800 text-xs flex items-center justify-center font-bold mt-0.5">2</span>
                          من أي لابتوب آخر، افتح المتصفح واكتب الـ IP (مثلاً: <code className="bg-indigo-200 px-1 rounded">http://192.168.1.50</code>).
                        </li>
                        <li className="flex items-start gap-3 text-indigo-800">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-200 text-indigo-800 text-xs flex items-center justify-center font-bold mt-0.5">3</span>
                          سجل الدخول بـ <code className="font-bold">Administrator</code> وكلمة السر التي اخترتها.
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-12 border-t border-slate-200">
                <button
                  disabled={activePhase === 1}
                  onClick={() => setActivePhase(prev => Math.max(1, prev - 1))}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                  <ChevronLeft className="w-5 h-5 rotate-180" />
                  المحافظة السابقة
                </button>
                {activePhase < 6 ? (
                  <button
                    onClick={() => {
                      if (!progress.includes(activePhase)) toggleProgress(activePhase);
                      setActivePhase(prev => Math.min(6, prev + 1));
                    }}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                  >
                    المرحلة التالية
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-green-600 font-bold text-lg">
                    <CheckCircle2 className="w-6 h-6" />
                    اكتملت جميع المراحل بنجاح!
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Quick Tips Tooltip */}
      <div className="fixed bottom-6 left-6 group">
        <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-0 mb-4 w-64 pointer-events-none">
          <h4 className="font-bold text-indigo-600 flex items-center gap-2 mb-2">
            <Info className="w-4 h-4" /> نصيحة سريعة
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            يفضل تثبيت الـ Static IP للابتوب السيرفر من إعدادات الراوتر لضمان عدم تغيره في المستقبل.
          </p>
        </div>
        <button className="w-12 h-12 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-indigo-600 hover:bg-indigo-50 transition-colors">
          <Info className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
