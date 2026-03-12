/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, MessageCircle, ArrowLeft } from 'lucide-react';

interface TimeElapsed {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeElapsed = (startDate: Date): TimeElapsed => {
  const now = new Date();
  const diff = now.getTime() - startDate.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
};

const CounterDisplay = ({ time, label }: { time: TimeElapsed; label: string }) => {
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="flex gap-3 md:gap-5 justify-center">
        {[
          { value: time.days, unit: 'Days' },
          { value: time.hours, unit: 'Hours' },
          { value: time.minutes, unit: 'Mins' },
          { value: time.seconds, unit: 'Secs' },
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <motion.div
              key={item.value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl md:text-2xl font-bold text-pink-200 drop-shadow-[0_0_8px_rgba(244,114,182,0.5)]"
            >
              {item.value.toString().padStart(2, '0')}
            </motion.div>
            <span className="text-[9px] uppercase tracking-widest text-pink-400/60 font-semibold">
              {item.unit}
            </span>
          </div>
        ))}
      </div>
      <p className="arabic-text text-xl md:text-2xl text-center text-pink-100/90 mt-1 leading-relaxed">
        {label}
      </p>
    </div>
  );
};

const FloatingHeart = ({ delay, left, size }: { delay: number; left: string; size: number }) => (
  <motion.div
    className="heart-particle text-pink-500/20"
    style={{ left, fontSize: size }}
    initial={{ y: '100vh', opacity: 0 }}
    animate={{ 
      y: '-10vh', 
      opacity: [0, 0.5, 0.5, 0],
      x: [0, Math.random() * 50 - 25, 0]
    }}
    transition={{ 
      duration: 10 + Math.random() * 10, 
      repeat: Infinity, 
      delay,
      ease: "linear" 
    }}
  >
    <Heart fill="currentColor" />
  </motion.div>
);

const ReasonCard: React.FC<{ text: string; index: number }> = ({ text, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 10) * 0.05 }}
      whileHover={{ scale: 1.01 }}
      className="p-6 rounded-2xl bg-white/10 border border-white/10 flex flex-col gap-3 relative overflow-hidden group min-h-[80px]"
    >
      <div className="absolute top-0 right-0 p-3 opacity-20">
        <Heart size={16} fill="currentColor" className="text-pink-400" />
      </div>
      <span className="text-[10px] text-pink-400/60 font-mono font-bold">#{index + 1}</span>
      <p className="arabic-text text-right text-white text-lg md:text-xl font-medium leading-relaxed">
        {text}
      </p>
    </motion.div>
  );
};

const reasons = [
  "بحبك عشان ابتسامتك بتخلّي يومي أحسن.",
  "بحبك عشان عيونك بتقول حاجات كتير من غير كلام.",
  "بحبك عشان صوتك بيهدّيني.",
  "بحبك عشان بتفهمي سكوتي.",
  "بحبك عشان بتخلّي أبسط لحظة تبقى حلوة.",
  "بحبك عشان حضنك بيريّحني.",
  "بحبك عشان ضحكتك بتعدّل مزاجي فورًا.",
  "بحبك عشان عمرك ما حكمتِ عليّ بسرعة.",
  "بحبك عشان بتكمّلي كلامي قبل ما أخلصه.",
  "بحبك عشان بتحبّيني بطريقتك الصادقة.",
  "بحبك عشان وجودك بيهوّن الأيام الصعبة.",
  "بحبك عشان لما بتمسكي إيدي بحسّ بالطمأنينة.",
  "بحبك عشان فاكرة التفاصيل الصغيرة عني.",
  "بحبك عشان بتفهمي لما أبقى قلقان.",
  "بحبك عشان حبك بسيط وصادق.",
  "بحبك عشان بتسمعيلي بجد.",
  "بحبك عشان قلبك طيب.",
  "بحبك عشان بتخلّيني عايز أبقى شخص أحسن.",
  "بحبك عشان صبرك معايا.",
  "بحبك عشان لما نزعل بترجعي تصلّحي الأمور.",
  "بحبك عشان عمرك ما سيبتيني أحس إني لوحدي.",
  "بحبك عشان وجودك بيطمني.",
  "بحبك عشان بتخلّيني أحس إني مهم عندك.",
  "بحبك عشان طريقتك الطيبة مع الناس.",
  "بحبك عشان طريقة نطقك لاسمي.",
  "بحبك عشان معاكي بحسّ بالراحة.",
  "بحبك عشان ثقتك فيّ.",
  "بحبك عشان بتقبلي عيوبي.",
  "بحبك عشان بتفكريني أهتم بنفسي.",
  "بحبك عشان بتضحكي على هزارِي.",
  "بحبك عشان وجودك مريح.",
  "بحبك عشان لما نتكلم الوقت بيعدّي بسرعة.",
  "بحبك عشان بتتشجّعيني على أحلامي.",
  "بحبك عشان لما أبقى مضايق بتحاولي تفهمي.",
  "بحبك عشان بتخلّيني أبتسم من غير سبب.",
  "بحبك عشان نظرتك ليا.",
  "بحبك عشان بتحبّيني حتى لما أبقى مش في أحسن حالاتي.",
  "بحبك عشان فاكرة لحظاتنا.",
  "بحبك عشان بحس إنك قريبة مني.",
  "بحبك عشان لمستك بتطمني.",
  "بحبك عشان عمرك ما اختفيتِ وقت ما احتاجتك.",
  "بحبك عشان بتخلّي الأيام العادية أحسن.",
  "بحبك عشان بتدعمي قراراتي.",
  "بحبك عشان كلامك بيشجّعني.",
  "بحبك عشان بتفهميني حتى من غير شرح طويل.",
  "بحبك عشان بتفرحي لفرحتي.",
  "بحبك عشان بتشاركي معايا تفاصيل يومك.",
  "بحبك عشان بحسّ معاكي بالراحة.",
  "بحبك عشان السكوت بينا مش غريب.",
  "بحبك عشان بتحسّي بيا لما أتعب.",
  "بحبك عشان وجودك في حياتي فرق.",
  "بحبك عشان بتسألي عني دايمًا.",
  "بحبك عشان بتخلّي يومي أهدى.",
  "بحبك عشان معاكي بحس إن في حد واقف جنبي.",
  "بحبك عشان بتفهمي اللي بين السطور.",
  "بحبك عشان بتحبّيني أنا زي ما أنا.",
  "بحبك عشان ما بتحسسينيش إني أقل.",
  "بحبك عشان وجودك بيخلّي الحياة أخف.",
  "بحبك عشان بتخلّي البعد أسهل.",
  "بحبك عشان كلامك بيطمني.",
  "بحبك عشان إنتِ سند ليا.",
  "بحبك عشان بتآمني بيا.",
  "بحبك عشان بتفرحي بنجاحي.",
  "بحبك عشان بتخفّفي عني الضغط.",
  "بحبك عشان حضنك بيريّحني.",
  "بحبك عشان بتفهمي لما أبقى مجروح.",
  "بحبك عشان حبك ثابت.",
  "بحبك عشان بتوقفي جنبي في الأيام الصعبة.",
  "بحبك عشان لما نبقى سوا بحسّ بالهدوء.",
  "بحبك عشان معاكي كل حاجة أبسط.",
  "بحبك عشان بتخلّي اللحظات الصغيرة مهمة.",
  "بحبك عشان طريقتك الهادية.",
  "بحبك عشان بتدفّي قلبي بكلامك.",
  "بحبك عشان صوتك لما تطمني عليّ.",
  "بحبك عشان خليتيني أصدق إن في حب بجد.",
  "بحبك عشان بتفضلي جنبي.",
  "بحبك عشان وجودك في حياتي ثابت.",
  "بحبك عشان وجودك بيخلّيني أهدى.",
  "بحبك عشان لما تكوني جنبي بحسّ بالأمان.",
  "بحبك عشان بتفهمي مزاجي.",
  "بحبك عشان اللحظات اللي قضيناها سوا.",
  "بحبك عشان بتوحشيني لما تغيبي.",
  "بحبك عشان بتخلّي الدنيا أحسن.",
  "بحبك عشان بتفكريني إن في أمل.",
  "بحبك عشان قيمتك كبيرة عندي.",
  "بحبك عشان بتخلّيني أستمتع بالحياة.",
  "بحبك عشان وجودك بيخلّي المستقبل أهدى.",
  "بحبك عشان بحب وجودك في يومي.",
  "بحبك عشان عمرك ما حسستيني إني سهل أتعوّض.",
  "بحبك عشان بتخلّي اللحظات ليها معنى.",
  "بحبك عشان دعمك ليا.",
  "بحبك عشان خليتيني أصدق إن في حد ممكن يفهمني.",
  "بحبك عشان بتخلّيني أشتاقلك.",
  "بحبك عشان وجودك مريح لقلبي.",
  "بحبك عشان معاكي الحب طبيعي.",
  "بحبك عشان بتفضلي تحاولي حتى لما نزعل.",
  "بحبك عشان وجودك هادي في حياتي.",
  "بحبك عشان كل لحظة معاكي ليها قيمة.",
  "بحبك عشان إنتِ أهم شخص في حياتي.",
  "وبحبك… عشان ببساطة إنتِ أنتِ."
];

export default function App() {
  const [view, setView] = useState<'counters' | 'message' | 'reasons'>('counters');
  const startDate1 = useMemo(() => new Date('2009-01-30T00:00:00'), []);
  const startDate2 = useMemo(() => new Date('2025-12-12T00:00:00'), []);

  const [time1, setTime1] = useState<TimeElapsed>(calculateTimeElapsed(startDate1));
  const [time2, setTime2] = useState<TimeElapsed>(calculateTimeElapsed(startDate2));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime1(calculateTimeElapsed(startDate1));
      setTime2(calculateTimeElapsed(startDate2));
    }, 1000);
    return () => clearInterval(timer);
  }, [startDate1, startDate2]);

  const hearts = useMemo(() => 
    Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 20,
      left: `${Math.random() * 100}%`,
      size: 10 + Math.random() * 30
    })), []);

  const messageText = `حبيبتي ... 
اولا ودايما وكالعادة بحبكككك اوييييي ، عارف محيطك قاسي عليكي وعارف ان محدش شايف او عارف اللي تعرفيه ، لكن انا هنا هكون الحضن اللي يحتويكي لما حاجة تزعلك ، لو ماحدش مهتم انا بهتم ، لو ماحدش بيحبك انا متيم ، لو ماحدش شايفك كافية انا شايفك كثيرة اوي عليا ، لو شايفين انك كسولة او مش مجتهدة انا شايف انك كيوتتت اوي ودلوعة قلبي وبحب دلعك يا قمري ، لوجي حبيبتي انا دايما هنا ، وبحتويكي للابد ، مزاجك متقلب ؟ بعشقه ، افكارك سوداوية ؟ احتويها واطمنك ، خايفة افكر انك بتمثلي عشان تشدي انتباهي ؟ انتي مش كدة وحتى لو كدة لو ما انتبهت لك بنتبه لمين ، نفسي تشوفي نفسك بعيني ، بحبك اوي يا بسكوتة بابا الصغننة ، وعن قريب إن شاء الله هحضنك اطول حضن في حياتك وبدال ما تدفني راسك في المخدة وتبكي هتحطي راسك على قلبي واحبحبك ...
واخيرا وليس آخرا ... بابا بيحبك`;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-romantic-5">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-pink-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-900/20 blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-romantic-1/10 blur-[100px]" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {hearts.map(heart => (
          <FloatingHeart key={heart.id} {...heart} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {view === 'counters' ? (
          <motion.div
            key="counters"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="glass relative z-10 w-full max-w-lg p-6 md:p-8 rounded-[2rem] flex flex-col items-center gap-8 overflow-hidden"
          >
            {/* Decorative elements inside card */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />
            
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-4 right-4 text-pink-400/20"
            >
              <Sparkles size={32} />
            </motion.div>

            <header className="flex flex-col items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-pink-500 mb-2"
              >
                <Heart size={48} fill="currentColor" />
              </motion.div>
              <h1 className="arabic-text text-xl tracking-wide text-pink-300/80 font-semibold">
                لوجي حبيبتي
              </h1>
            </header>

            <div className="flex flex-col gap-12 w-full">
              <CounterDisplay 
                time={time1} 
                label="بحبك بعدد كل ثانية عشتيها" 
              />
              
              <div className="w-full h-px bg-gradient-to-r from-transparent via-pink-500/20 to-transparent" />

              <CounterDisplay 
                time={time2} 
                label="شفتي بقالك كام يوم منورة حياتي" 
              />
            </div>

            <div className="flex flex-col gap-3 w-full mt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setView('message')}
                className="flex items-center justify-center gap-3 w-full py-3 rounded-2xl bg-pink-500/20 border border-pink-500/30 text-pink-200 hover:bg-pink-500/30 transition-all duration-300 group"
              >
                <MessageCircle size={18} className="group-hover:rotate-12 transition-transform" />
                <span className="arabic-text text-lg">رسالة</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setView('reasons')}
                className="flex items-center justify-center gap-3 w-full py-3 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-300/80 hover:bg-pink-500/20 transition-all duration-300 group"
              >
                <Heart size={18} className="group-hover:scale-110 transition-transform" />
                <span className="arabic-text text-lg">100 سبب عشان احبك</span>
              </motion.button>
            </div>

            <footer className="mt-2">
              <p className="arabic-text text-sm tracking-wide text-pink-400/60">
                من رحمونك
              </p>
            </footer>
          </motion.div>
        ) : view === 'message' ? (
          <motion.div
            key="message"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="glass relative z-10 w-full max-w-lg p-6 md:p-8 rounded-[2rem] flex flex-col items-center gap-6 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />
            
            <div className="w-full flex justify-start">
              <motion.button
                whileHover={{ x: -5 }}
                onClick={() => setView('counters')}
                className="flex items-center gap-2 text-pink-300/60 hover:text-pink-300 transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="text-xs uppercase tracking-widest">Back</span>
              </motion.button>
            </div>

            <div className="flex flex-col items-center gap-6 w-full">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-pink-500"
              >
                <Heart size={40} fill="currentColor" />
              </motion.div>
              
              <div className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar" dir="rtl">
                <p className="arabic-text text-xl md:text-2xl text-right text-pink-100/90 leading-[1.7] whitespace-pre-line">
                  {messageText}
                </p>
              </div>
            </div>

            <footer className="mt-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-pink-400/40">
                With All My Love
              </p>
            </footer>
          </motion.div>
        ) : (
          <motion.div
            key="reasons"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="glass relative z-10 w-full max-w-lg p-6 md:p-8 rounded-[2rem] flex flex-col items-center gap-6 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />
            
            <div className="w-full flex justify-start">
              <motion.button
                whileHover={{ x: -5 }}
                onClick={() => setView('counters')}
                className="flex items-center gap-2 text-pink-300/60 hover:text-pink-300 transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="text-xs uppercase tracking-widest">Back</span>
              </motion.button>
            </div>

            <header className="flex flex-col items-center gap-2">
              <Heart size={32} fill="currentColor" className="text-pink-500" />
              <h2 className="arabic-text text-2xl text-pink-200">100 سبب عشان احبك</h2>
            </header>

            <div className="w-full max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-4" dir="rtl">
              {reasons.map((reason, idx) => (
                <ReasonCard key={idx} text={reason} index={idx} />
              ))}
            </div>

            <footer className="mt-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-pink-400/40">
                Every Reason is You
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient Light Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(244, 114, 182, 0.3);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
