/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
  HelpCircle,
  ChevronLeft,
  Settings2,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Command {
  label?: string;
  text: string;
  explanation?: string;
}

interface CommandSet {
  title: string;
  commands: Command[];
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
            { label: "إصلاح محرك الـ DNS", text: 'echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf' },
            { label: "تعطيل مستودع الـ CD-ROM", text: "sudo sed -i '/cdrom/s/^/#/' /etc/apt/sources.list" },
            { label: "تحديث مستودعات النظام", text: "sudo apt update && sudo apt upgrade -y" },
            { label: "تحميل الحزم الأساسية والتبعية", text: "sudo apt install git curl python3-dev python3-pip python3-venv redis-server mariadb-server mariadb-client software-properties-common -y" }
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
            { label: "إضافة مستودع Node.js 18", text: "curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -" },
            { label: "تثبيت Node.js", text: "sudo apt install -y nodejs" },
            { label: "تثبيت مدير الحزم Yarn", text: "sudo npm install -g yarn" }
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
          title: "تأمين MariaDB وإعطاء الصلاحيات",
          commands: [
            { label: "تأمين القاعدة الأساسي", text: "sudo mysql_secure_installation", explanation: "تأمين القاعدة ووضع كلمة سر الـ Root." },
            { 
              label: "منح صلاحيات الـ Root الكاملة",
              text: "sudo mysql -u root -p -e \"GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' IDENTIFIED BY 'كلمة_سر_القاعدة' WITH GRANT OPTION; FLUSH PRIVILEGES;\"",
              explanation: "ضمان صلاحيات الوصول الكاملة لعمليات التثبيت."
            }
          ]
        },
        {
          title: "إضافة إعدادات ERPNext الخاصة",
          commands: [
            { label: "تعديل ملف الإعدادات 50-erpnext.cnf", text: 'sudo bash -c "cat > /etc/mysql/mariadb.conf.d/50-erpnext.cnf <<EOF\n[server]\nuser = mysql\npid-file = /run/mysqld/mysqld.pid\nsocket = /run/mysqld/mysqld.sock\nbasedir = /usr\ndatadir = /var/lib/mysql\ntmpdir = /tmp\nlc-messages-dir = /usr/share/mysql\nbind-address = 0.0.0.0\n\n[mysqld]\ninnodb-check-optimize-scan = ON\ninnodb-buffer-pool-size = 1G\ninnodb-log-file-size = 256M\ninnodb-file-per-table = 1\ncharacter-set-server = utf8mb4\ncollation-server = utf8mb4_unicode_ci\n\n[mysql]\ndefault-character-set = utf8mb4\nEOF"' },
            { label: "إعادة تشغيل MariaDB", text: "sudo systemctl restart mariadb" }
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
          commands: [{ label: "تثبيت أداة Bench", text: "sudo pip3 install frappe-bench --break-system-packages" }]
        },
        {
          title: "إنشاء مجلد السيرفر وتحميل Frappe",
          commands: [
            { 
              label: "بناء بيئة العمل (Bench Init)",
              text: "bench init frappe-bench --frappe-branch version-16",
              explanation: "تحميل نظام Frappe النسخة 16."
            }, 
            { label: "الدخول لمجلد السيرفر", text: "cd frappe-bench" }
          ]
        },
        {
          title: "إنشاء موقع جديد وضبطه كافتراضي",
          commands: [
            { 
              label: "إنشاء الموقع الجديد",
              text: "bench new-site site1.local",
              explanation: "إنشاء قاعدة بيانات الموقع (احفظ كلمة سر الأدمن)."
            },
            {
              label: "تعيين الموقع كافتراضي الـ Default",
              text: "bench set-default-site site1.local",
              explanation: "إخبار السيرفر بفتح هذا الموقع تلقائياً عند طلب الـ IP."
            }
          ]
        },
        {
          title: "تحميل وتثبيت ERPNext و HRMS (الموارد البشرية)",
          commands: [
            { label: "تحميل تطبيق ERPNext", text: "bench get-app erpnext --branch version-16" },
            { label: "تثبيت ERPNext على الموقع", text: "bench --site site1.local install-app erpnext" },
            { 
              label: "تحميل تطبيق الموارد البشرية HRMS",
              text: "bench get-app hrms --branch version-16",
              explanation: "في V16، الموارد البشرية والرواتب أصبحت تطبيقاً منفصلاً."
            },
            { label: "تثبيت HRMS على الموقع", text: "bench --site site1.local install-app hrms" }
          ]
        }
      ]
    },
    {
      id: 5,
      title: "محرك الطباعة (PDF)",
      icon: <CheckCircle2 className="w-5 h-5" />,
      description: "تثبيت wkhtmltopdf لاستخراج الفواتير والتقارير بصيغة PDF.",
      content: [
        {
          title: "تحميل وتثبيت النسخة المتوافقة",
          commands: [
            { label: "الذهاب لمجلد الملفات المؤقتة", text: "cd /tmp" },
            { label: "تحميل حزمة wkhtmltox", text: "wget https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6.1-2/wkhtmltox_0.12.6.1-2.jammy_amd64.deb" },
            { label: "تثبيت الحزمة", text: "sudo apt install ./wkhtmltox_0.12.6.1-2.jammy_amd64.deb -y", explanation: "هذه النسخة تدعم Ubuntu 22.04+ بشكل كامل." }
          ]
        }
      ]
    },
    {
      id: 6,
      title: "استقرار النظام والإنتاج",
      icon: <Globe className="w-5 h-5" />,
      description: "تحويل النظام للإنتاج وإضافة ذاكرة Swap لمنع التهنيج.",
      content: [
        {
          title: "إعداد وضع الإنتاج",
          commands: [
            { label: "تفعيل Production Mode", text: "sudo bench setup production $(whoami)" },
            { label: "السماح بمرور الـ HTTP", text: "sudo ufw allow 80/tcp" },
            { label: "السماح بمرور الـ HTTPS", text: "sudo ufw allow 443/tcp" },
            { label: "إعادة تحميل جدار الحماية", text: "sudo ufw reload" }
          ]
        },
        {
          title: "إضافة ذاكرة Swap (4GB)",
          commands: [
            { label: "حجز مساحة الـ Swap", text: "sudo fallocate -l 4G /swapfile" },
            { label: "ضبط الصلاحيات", text: "sudo chmod 600 /swapfile" },
            { label: "تعريف الملف كـ Swap", text: "sudo mkswap /swapfile" },
            { label: "تفعيل الـ Swap حالياً", text: "sudo swapon /swapfile" },
            { label: "تثبيت الـ Swap في الـ fstab", text: "echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab", explanation: "تفعيل الـ Swap بشكل دائم حتى بعد إعادة التشغيل." }
          ]
        }
      ]
    },
    {
      id: 7,
      title: "إعدادات اللابتوب النهائية",
      icon: <Settings2 className="w-5 h-5" />,
      description: "منع الخمول عند إغلاق الغطاء ومعرفة عنوان الـ IP.",
      content: [
        {
          title: "منع وضع النوم (Sleep) عند إغلاق الغطاء",
          commands: [
            { label: "تعديل ملف logind.conf", text: "sudo sed -i 's/#HandleLidSwitch=suspend/HandleLidSwitch=ignore/' /etc/systemd/logind.conf" },
            { label: "إعادة تشغيل خدمة Login", text: "sudo systemctl restart systemd-logind" }
          ]
        },
        {
          title: "معرفة عنوان الـ IP للاتصال",
          commands: [{ label: "إظهار عناوين الـ IP المحلية", text: "hostname -I" }]
        }
      ]
    },
    {
      id: 8,
      title: "تحديث النظام وصيانته",
      icon: <Settings2 className="w-5 h-5" />,
      description: "كيفية تحديث ERPNext بشكل آمن والحفاظ على استقرار السيرفر.",
      content: [
        {
          title: "1. خطوة الأمان: النسخ الاحتياطي اليدوي",
          commands: [
            { 
              label: "أخذ نسخة احتياطية للموقع", 
              text: "bench --site site1.local backup", 
              explanation: "يجب دائماً عمل نسخة احتياطية قبل أي تحديث. الملفات ستكون في مجلد sites/site1.local/private/backups." 
            }
          ]
        },
        {
          title: "2. عملية التحديث الشاملة",
          commands: [
            { 
              label: "تحميل التحديثات (Code Update)", 
              text: "bench update", 
              explanation: "هذا الأمر يسحب آخر نسخة من الكود ويحدث مكتبات Python و Node.js." 
            },
            { 
              label: "تطبيق التغييرات على القاعدة (Migrate)", 
              text: "bench --site site1.local migrate", 
              explanation: "ضروري بعد التحديث لمزامنة جداول قاعدة البيانات مع الكود الجديد." 
            }
          ]
        },
        {
          title: "3. تحسين الأداء بعد التحديث",
          commands: [
            { 
              label: "تنظيف ذاكرة الكاش", 
              text: "bench --site site1.local clear-cache", 
              explanation: "يحل مشاكل الواجهة والأزرار التي قد تظهر أحياناً بعد التحديث." 
            }
          ]
        }
      ]
    },
    {
      id: 9,
      title: "اللمسات التشغيلية النهائية",
      icon: <CheckCircle2 className="w-5 h-5" />,
      description: "تأمين السيرفر وضمان استمرارية العمل (الـ 5% المتبقية لنجاح المشروع).",
      content: [
        {
          title: "1. الحماية من الاختراق (Fail2Ban)",
          commands: [
            { 
              label: "تثبيت Fail2Ban", 
              text: "sudo apt install fail2ban -y", 
              explanation: "أداة ضرورية جداً لحظر أي IP يحاول تخمين كلمات السر بشكل خاطئ متكرر." 
            }
          ]
        },
        {
          title: "2. نصائح تقنية وتوصية الهاردوير",
          commands: []
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
      <aside className="w-full md:w-80 bg-white border-l border-slate-200 p-6 flex flex-col gap-8 h-screen sticky top-0 overflow-y-auto command-scrollbar">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Laptop className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">ERPNext V16</h1>
          </div>
          <p className="text-sm text-slate-500 font-medium">سيرفر لابتوب احترافي</p>
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
          <button
              onClick={() => setActivePhase(99)}
              className={`flex items-center gap-4 p-3 rounded-xl text-right transition-all duration-200 group ${
                activePhase === 99
                  ? 'bg-orange-50 text-orange-700 shadow-sm ring-1 ring-orange-200'
                  : 'text-slate-600 hover:bg-orange-50'
              }`}
            >
              <div className={`p-2 rounded-lg transition-colors ${
                activePhase === 99 ? 'bg-orange-100' : 'bg-slate-100 group-hover:bg-orange-100'
              }`}>
                <Info className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-bold truncate">إدارة الموظفين</div>
                <div className="text-[10px] text-orange-400">ماذا بعد التشغيل؟</div>
              </div>
            </button>
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
      <main className="flex-1 p-6 md:p-12 max-w-5xl mx-auto w-full overflow-y-auto">
        <AnimatePresence mode="wait">
          {activePhase === 99 ? (
            <motion.div
              key="users-guide"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="pb-8 border-b border-slate-200">
                <h2 className="text-4xl font-extrabold text-slate-900 mb-4">دليل إدارة الموظفين والصلاحيات</h2>
                <p className="text-slate-600 text-lg">بعد تشغيل النظام، اتبع هذه الخطوات داخل متصفح Chrome لإضافة فريق عملك:</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "1. الوصول لقائمة الموظفين",
                    steps: ["من شريط البحث العلوي ابحث عن User List.", "اضغط على زر Add User في الزاوية العلوية."]
                  },
                  {
                    title: "2. إدخال البيانات الأساسية",
                    steps: ["أدخل البريد الإلكتروني للموظف.", "أدخل الاسم الأول والأخير.", "ألغِ خيار Send Welcome Email إذا كان الموقع محلياً."]
                  },
                  {
                    title: "3. تعيين كلمة السر",
                    steps: ["من تبويب Change Password قم بتعيين كلمة سر للموظف.", "هذه هي الكلمة التي سيدخل بها."]
                  },
                  {
                    title: "4. توزيع الصلاحيات (Roles)",
                    steps: ["انزل لأسفل لقسم Roles.", "اختر الصلاحيات (مثلاً: Accounts User للمحاسب).", "اختر Employee لموظف الموارد البشرية."]
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-bold text-indigo-700 mb-4">{item.title}</h3>
                    <ul className="space-y-3">
                      {item.steps.map((step, sIdx) => (
                        <li key={sIdx} className="flex gap-3 text-slate-600 text-sm">
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="bg-orange-50 border border-orange-200 p-8 rounded-2xl">
                <div className="flex gap-4">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Settings2 className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-orange-900 mb-2">نصيحة أمنية هامة</h4>
                    <p className="text-orange-800">
                      لا تعطِ صلاحية <code className="bg-orange-200 px-1 rounded">System Manager</code> إلا لأشخاص تثق بهم تماماً، لأن هذه الصلاحية تسمح لهم بحذف النظام بالكامل أو تغيير إعدادات السيرفر.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 p-8 rounded-2xl">
                <div className="flex gap-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-green-900 mb-2">النظام جاهز للعمل!</h4>
                    <p className="text-green-800 leading-relaxed">
                      لقد قمت بإعدادERPNext V16 بنجاح. الآن يمكنك البدء بإعداد شركتك وتخصيص النظام حسب احتياجاتك.
                      تذكر مراجعة <span className="font-bold">المرحلة 9</span> للحصول على اللمسات النهائية لضمان استقرار السيرفر.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
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
                      <Circle className="w-5 h-5" />
                      تحديد كمكتمل
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-12">
                {phases.find(p => p.id === activePhase)?.content.map((section, sIdx) => (
                  <section key={sIdx} className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-indigo-500" />
                        {section.title}
                      </h3>
                      {section.commands.length > 1 && (
                        <button 
                          onClick={() => {
                            const allCmds = section.commands.map(c => c.text).join('\n');
                            handleCopy(allCmds, `all-${sIdx}`);
                          }}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            copiedIndex === `all-${sIdx}` 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 outline-none ring-offset-2 focus:ring-2 focus:ring-indigo-500'
                          }`}
                        >
                          {copiedIndex === `all-${sIdx}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedIndex === `all-${sIdx}` ? 'تم نسخ الكل' : 'نسخ جميع الأوامر'}
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-8">
                      {section.commands.map((cmd, cIdx) => (
                        <div key={cIdx} className="space-y-3">
                          {cmd.label && (
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mr-1">
                              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
                              {cmd.label}
                            </div>
                          )}
                          <div 
                            className={`group relative bg-[#0d1117] rounded-xl overflow-hidden shadow-2xl transition-all border border-slate-800/60 ${
                              copiedIndex === `${sIdx}-${cIdx}` ? 'ring-2 ring-indigo-500/50 border-indigo-500/30' : 'hover:border-slate-700'
                            }`}
                           dir="ltr">
                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800/60">
                              <div className="flex items-center gap-4">
                                <div className="flex gap-1.5">
                                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                                </div>
                                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest ml-2">bash — {cmd.label || 'terminal'}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {cmd.explanation && (
                                  <div className="group/hint relative" dir="rtl">
                                    <HelpCircle className="w-4 h-4 text-slate-500 cursor-help hover:text-indigo-400 transition-colors" />
                                    <div className="absolute bottom-full right-0 mb-3 w-72 bg-slate-800 text-white text-xs p-3 rounded-xl shadow-2xl opacity-0 group-hover/hint:opacity-100 transition-all transform translate-y-1 group-hover/hint:translate-y-0 pointer-events-none z-30 text-right border border-slate-700">
                                      <p className="font-medium leading-relaxed">{cmd.explanation}</p>
                                      <div className="absolute top-full right-4 border-[6px] border-transparent border-t-slate-800" />
                                    </div>
                                  </div>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopy(cmd.text, `${sIdx}-${cIdx}`);
                                  }}
                                  className={`flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                                    copiedIndex === `${sIdx}-${cIdx}` 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700'
                                  }`}
                                >
                                  {copiedIndex === `${sIdx}-${cIdx}` ? (
                                    <><Check className="w-3 h-3" /> COPIED</>
                                  ) : (
                                    <><Copy className="w-3 h-3" /> COPY</>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Command Area */}
                            <div 
                              className="relative cursor-pointer active:bg-white/5 transition-colors p-5 overflow-x-auto command-scrollbar text-left"
                              dir="ltr"
                              onClick={() => handleCopy(cmd.text, `${sIdx}-${cIdx}`)}
                            >
                              <div className="flex items-start font-mono text-sm leading-relaxed" style={{ direction: 'ltr' }}>
                                <span className="text-pink-500 mr-4 select-none shrink-0 font-bold">$</span>
                                <code className="text-slate-100 whitespace-pre text-left flex-1 font-mono selection:bg-indigo-500/30">
                                  {cmd.text}
                                </code>
                              </div>
                              
                              <AnimatePresence>
                                {copiedIndex === `${sIdx}-${cIdx}` && (
                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-green-500/10 flex items-center justify-center pointer-events-none"
                                  >
                                    <div className="bg-green-600 text-white text-[10px] px-3 py-1.5 rounded-full font-bold shadow-2xl flex items-center gap-2">
                                      <Check className="w-3 h-3" /> تم نسخ الأمر بنجاح
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

                {activePhase === 7 && (
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
                            من أي لابتوب آخر، افتح المتصفح واكتب الـ IP مباشرة (دون الحاجة لبورت :8000 بفضل وضع الإنتاج).
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

                {activePhase === 9 && (
                  <div className="space-y-8 mt-12">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-2xl border border-slate-200">
                        <h4 className="font-bold text-indigo-700 flex items-center gap-2 mb-4">
                          <Globe className="w-5 h-5" /> إعداد البريد (SMTP)
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">
                          ERPNext بدون إيميل لا يمكنه إرسال فواتير أو استعادة كلمات السر.
                        </p>
                        <ul className="text-xs space-y-2 text-slate-500">
                          <li>• ابحث عن <span className="font-bold">Email Domain</span> بعد الدخول.</li>
                          <li>• في Gmail، استخدم <span className="font-bold">App Password</span> حصراً.</li>
                        </ul>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-slate-200">
                        <h4 className="font-bold text-orange-700 flex items-center gap-2 mb-4">
                          <Settings2 className="w-5 h-5" /> التعريب والضبط
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">
                          عند الـ Setup Wizard الأول:
                        </p>
                        <ul className="text-xs space-y-2 text-slate-500">
                          <li>• اختر <span className="font-bold">العربية</span> (مدعومة 100%).</li>
                          <li>• تأكد من دقة <span className="font-bold">المنطقة الزمنية</span> للبصمة والمواعيد.</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-indigo-900 text-white p-8 rounded-2xl relative overflow-hidden">
                      <div className="relative z-10">
                        <h3 className="text-xl font-extrabold mb-4">التوصية الذهبية للهاردوير ⚡</h3>
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="flex gap-4">
                            <div className="shrink-0 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-bold text-xl">1</div>
                            <p className="text-sm text-indigo-100 italic">"الشاحن يجب أن يظل موصولاً 24/7. انقطاع الكهرباء هو العدو الأول لقواعد البيانات."</p>
                          </div>
                          <div className="flex gap-4">
                            <div className="shrink-0 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-bold text-xl">2</div>
                            <p className="text-sm text-indigo-100 italic">"وفر تهوية ممتازة. السيرفر يولد حرارة أكبر من التصفح العادي، لا تضعه في مكان مغلق."</p>
                          </div>
                        </div>
                      </div>
                      <Server className="absolute -bottom-12 -right-12 w-64 h-64 text-white/5" />
                    </div>
                  </div>
                )}

                {/* Navigation buttons */}
                <div className="flex items-center justify-between pt-12 border-t border-slate-200">
                  <button
                    disabled={activePhase === 1}
                    onClick={() => setActivePhase(prev => Math.max(1, prev - 1))}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                  >
                    <ChevronLeft className="w-5 h-5 rotate-180" />
                    المرحلة السابقة
                  </button>
                  {activePhase < 9 ? (
                    <button
                      onClick={() => {
                        if (!progress.includes(activePhase)) toggleProgress(activePhase);
                        setActivePhase(prev => Math.min(9, prev + 1));
                      }}
                      className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                    >
                      المرحلة التالية
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setActivePhase(99)}
                      className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-orange-600 text-white shadow-lg shadow-orange-100 hover:bg-orange-700 transition-all"
                    >
                      انتقل لتعلم إدارة الموظفين
                      <Info className="w-5 h-5" />
                    </button>
                  )}
                </div>
            </motion.div>
          )}
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
