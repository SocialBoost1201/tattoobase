'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, X, ChevronRight, Sparkles, MessageCircle } from 'lucide-react';
import Link from 'next/link';

type Step = 'welcome' | 'question1' | 'question2' | 'question3' | 'result';

const STYLES_MAP: Record<string, string[]> = {
  シンプル: ['ミニマル', 'レタリング'],
  '個性的・アート': ['ニュースクール', 'アニメ'],
  '伝統・和': ['和彫'],
  'かっこいい・渋い': ['ブラックアンドグレー', 'トラディショナル'],
};

const BODY_PART_ARTISTS: Record<string, string> = {
  '手首・手・指': 'ミニマル',
  '腕・前腕': 'ブラックアンドグレー',
  '背中・胸': '和彫',
  '足・太もも': 'トラディショナル',
  'まだ決めていない': 'ブラックアンドグレー',
};

const QUESTIONS = [
  {
    id: 'q1',
    text: 'どんなイメージのタトゥーが気になりますか？',
    options: ['シンプル', '個性的・アート', '伝統・和', 'かっこいい・渋い'],
  },
  {
    id: 'q2',
    text: '入れたい部位はイメージにありますか？',
    options: ['手首・手・指', '腕・前腕', '背中・胸', '足・太もも', 'まだ決めていない'],
  },
  {
    id: 'q3',
    text: 'ご予算の目安を教えてください',
    options: ['〜¥20,000', '¥20,000〜¥80,000', '¥80,000〜', '予算はこだわらない'],
  },
];

export default function AIStyleAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>('welcome');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [step]);

  const handleAnswer = (questionId: string, answer: string) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    if (questionId === 'q1') setStep('question2');
    else if (questionId === 'q2') setStep('question3');
    else if (questionId === 'q3') setStep('result');
  };

  const recommendedStyles = step === 'result'
    ? [...(STYLES_MAP[answers.q1] ?? []), BODY_PART_ARTISTS[answers.q2] ?? '']
        .filter((v, i, a) => v && a.indexOf(v) === i)
        .slice(0, 2)
    : [];

  const reset = () => {
    setStep('welcome');
    setAnswers({});
  };

  return (
    <>
      {/* フローティングボタン */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full bg-white shadow-2xl shadow-white/20 flex items-center justify-center hover:scale-110 transition-transform group"
          aria-label="AIスタイルアシスタント"
        >
          <Sparkles className="w-6 h-6 text-black group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {/* チャットパネル */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 left-4 md:left-auto md:w-80 z-50 bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[70vh]">
          {/* ヘッダー */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-black/60 backdrop-blur-xl shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-bold">TattooBase AI</p>
                <p className="text-neutral-500 text-[10px]">あなたに合うスタイルを提案します</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* チャット本文 */}
          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* AIメッセージ: ウェルカム */}
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-3 h-3 text-white" />
              </div>
              <div className="bg-neutral-900 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-white max-w-[85%]">
                {step === 'welcome' ? (
                  <>
                    <p className="mb-3">こんにちは！🎨<br />タトゥーが初めての方でも安心して相談できます。</p>
                    <p className="text-neutral-400 text-xs mb-3">3つの質問に答えるだけで、あなたに合うアーティストをご提案します。</p>
                    <button onClick={() => setStep('question1')}
                      className="w-full bg-white text-black text-xs font-bold py-2.5 rounded-full hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1">
                      スタート <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : step === 'question1' ? (
                  <p>{QUESTIONS[0].text}</p>
                ) : step === 'question2' ? (
                  <>
                    {/* ユーザー回答 */}
                    <div className="mb-3 flex justify-end">
                      <span className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full inline-block">
                        {answers.q1}
                      </span>
                    </div>
                    <p>{QUESTIONS[1].text}</p>
                  </>
                ) : step === 'question3' ? (
                  <>
                    <div className="mb-3 flex justify-end">
                      <span className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full inline-block">
                        {answers.q2}
                      </span>
                    </div>
                    <p>{QUESTIONS[2].text}</p>
                  </>
                ) : step === 'result' ? (
                  <>
                    <div className="mb-3 flex justify-end">
                      <span className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full inline-block">
                        {answers.q3}
                      </span>
                    </div>
                    <p className="mb-3">
                      ✨ ありがとうございます！<br />
                      あなたには <strong>{recommendedStyles.join(' / ')}</strong> のスタイルがぴったりです。
                    </p>
                    <p className="text-neutral-400 text-xs mb-4">
                      このスタイルが得意なアーティストを検索してみましょう。
                    </p>
                    <div className="space-y-2">
                      {recommendedStyles.map(style => (
                        <Link key={style}
                          href={`/search?type=artist&genre=${encodeURIComponent(style)}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between w-full bg-white text-black text-xs font-bold px-4 py-2.5 rounded-full hover:bg-neutral-200 transition-colors">
                          <span>{style}のアーティストを探す</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      ))}
                    </div>
                    <button onClick={reset} className="mt-3 text-neutral-500 text-xs hover:text-white transition-colors underline w-full text-center">
                      もう一度診断する
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          {/* 選択肢ボタン */}
          {step !== 'welcome' && step !== 'result' && (
            <div className="p-3 border-t border-neutral-900 shrink-0">
              <div className="flex flex-col gap-1.5">
                {QUESTIONS[['question1', 'question2', 'question3'].indexOf(step)]?.options.map((opt: string) => (
                  <button key={opt} onClick={() => handleAnswer(
                    ['question1', 'question2', 'question3'].indexOf(step) === 0 ? 'q1'
                    : ['question1', 'question2', 'question3'].indexOf(step) === 1 ? 'q2' : 'q3',
                    opt
                  )}
                    className="text-left text-xs text-white font-medium px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-800 transition-all flex items-center justify-between group">
                    <span>{opt}</span>
                    <ChevronRight className="w-3 h-3 text-neutral-600 group-hover:text-white transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
