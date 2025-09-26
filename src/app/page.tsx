"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  // layout / brand
  Sparkles,
  // nav
  Menu,
  X,
  // visuals
  Image as ImageIcon,
  GalleryHorizontalEnd,
  // actions / flow
  ArrowRight,
  Send,
  CreditCard,
  ShieldCheck,
  // social
  MessagesSquare, // Discord
  MessageCircle,  // Kakao
  // content
  Star,
  Quote,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/* =========================================================
   UTIL
========================================================= */
const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

/* =========================================================
   SIMPLE PLACEHOLDER IMAGE
========================================================= */
function Placeholder({
  label = "Preview",
  ratio = "pb-[56%]",
}: {
  label?: string;
  ratio?: string;
}) {
  return (
    <div
      className={`w-full ${ratio} relative bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl`}
    >
      <div className="absolute inset-0 flex items-center justify-center gap-2 text-neutral-500">
        <ImageIcon className="w-5 h-5" />
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
}

/* =========================================================
   NAVBAR
========================================================= */
function Navbar({ onContact }: { onContact: () => void }) {
  const [open, setOpen] = useState(false);
  const nav = useMemo(
    () => [
      { name: "Portfolio", href: "#portfolio" },
      { name: "Services & Pricing", href: "#services" },
      { name: "Process", href: "#process" },
      { name: "Reviews", href: "#reviews" },
      { name: "FAQ", href: "#faq" },
    ],
    []
  );

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur bg-white/70 border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          <span className="font-bold">MIYA DESIGN</span>
          <Badge variant="secondary" className="ml-2">
            Banner · Logo · Title
          </Badge>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {nav.map((n) => (
            <a key={n.name} href={n.href} className="text-sm hover:opacity-80">
              {n.name}
            </a>
          ))}
          <Button className="rounded-2xl" onClick={onContact}>
            문의 / 의뢰하기
          </Button>
        </nav>

        <button
          className="md:hidden p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-[max-height] duration-300 overflow-hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-4 pb-4 flex flex-col gap-3">
          {nav.map((n) => (
            <a
              key={n.name}
              href={n.href}
              onClick={() => setOpen(false)}
              className="py-1"
            >
              {n.name}
            </a>
          ))}
          <Button
            className="rounded-2xl"
            onClick={() => {
              setOpen(false);
              onContact();
            }}
          >
            문의 / 의뢰하기
          </Button>
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   CONTACT DIALOG (Kakao + Discord only)
========================================================= */
function ContactDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>의뢰/문의</DialogTitle>
          <DialogDescription>
            카카오톡 또는 디스코드로 연락 주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              외부 채널로 대화가 진행됩니다.
            </span>
            <div className="flex gap-2">
              <Button asChild className="rounded-2xl">
                <a
                  href="https://open.kakao.com/o/slHj1bUh"
                  target="_blank"
                  rel="noreferrer"
                >
                  카카오톡 문의 <MessageCircle className="w-4 h-4 ml-1" />
                </a>
              </Button>
              <Button asChild variant="secondary" className="rounded-2xl">
                <a
                  href="https://discord.gg/QPZnJcvAGG"
                  target="_blank"
                  rel="noreferrer"
                >
                  디스코드 문의 <MessagesSquare className="w-4 h-4 ml-1" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================
   SECTION WRAPPER
========================================================= */
function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="max-w-6xl mx-auto px-4 py-14">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
          {title}
        </h2>
        {subtitle && <p className="text-neutral-500 mt-2">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

/* =========================================================
   REVIEWS (with localStorage)
========================================================= */
type Review = {
  id: string;
  author: string;
  date?: string;
  rating: number; // 1 ~ 5
  text: string;
};

const seedReviews: Review[] = [
  {
    id: "r-001",
    author: "— 2025-08-25",
    date: "2025-08-25",
    rating: 5,
    text:
      "“이건 단순한 이모지가 아니다… 운명을 바꾸는 이모지이다!” 처음엔 반신반의했지만 첫 의뢰 5분 만에 인생이 바뀌었습니다. 화려한 그림, 폭풍 같은 작업 속도, 그리고 전설의 이모지를 손에 쥐는 순간! ‘내 이모지가 쓰일 때마다 전설이다!’",
  },
  {
    id: "r-002",
    author: "만두",
    date: "2025-09-13",
    rating: 5,
    text: "보고 제 꼭지가 섰습니다. 이 한마디가 모든 의미를 담습니다.",
  },
  {
    id: "r-003",
    author: "뿌우우우우우웅깡",
    date: "2025-09-15",
    rating: 5,
    text:
      "MIYA 샵에서 새 이모티콘 세트 구매. 서버 반응 더 다양해지고 채팅이 재미있어졌어요 😂 귀여운 리액션이 많아 밈 만들 때도 최고. ‘어디서 샀냐’고 물어볼 정도!",
  },
  {
    id: "r-004",
    author: "반디집",
    date: "2025-09-15",
    rating: 5,
    text:
      "평범했던 채팅이 이제는 예술이 되었어요. 감정을 표현할 때 미묘한 느낌을 미야 이모지가 찰떡같이 대신해 줍니다. ‘사람은 바꿀 수 없어도, 이모지는 바꿀 수 있다.’",
  },
  {
    id: "r-005",
    author: "suye0l_",
    date: "2025-09-16",
    rating: 5,
    text:
      "이모지 하나 사려고 왔다가 풀세트 맞췄습니다. 정교하고 섬세한 퀄리티에 만족도 폭발. 망설이시는 분들, 망설이는 동안 순서만 밀립니다. 지금 문의 버튼을 바로 누르세요!",
  },
  {
    id: "r-006",
    author: "ო SONG",
    date: "2025-09-18",
    rating: 5,
    text:
      "키워드만 드렸는데 1%도 부족함 없이 취향 저격. 작업 하나에도 시간과 정성을 쏟는 모습에 감동. 가격은 저렴하지만 퀄리티는 100배!",
  },
  {
    id: "r-007",
    author: "요한",
    date: "2025-09-21",
    rating: 5,
    text: "이 가격에 이 퀄리티… 고민은 완성만 늦출 뿐이에요.",
  },
  {
    id: "r-008",
    author: "도윤성",
    date: "2025-09-23",
    rating: 5,
    text:
      "가격 대비 디자인 완성도와 디테일 모두 훌륭합니다. 다음에도 또 이용할게요. 감사합니다!",
  },
  {
    id: "r-009",
    author: "ㅎㅇ",
    date: "2025-09-24",
    rating: 5,
    text:
      "너무 이쁘고 깔끔한 미야 샵. 가격 대비 퀄리티가 뛰어나고 정성 가득한 결과물. 한마디로 사장님이 느좋이고 상품이 친절합니다(?)",
  },
  {
    id: "r-010",
    author: "장꾸",
    date: "2025-09-25",
    rating: 5,
    text: "상담 대응부터 결과물까지 50% 할인 혜택에 퀄리티 미쳤습니다. 이쁨!",
  },
  {
    id: "r-011",
    author: "김두한",
    date: "2025-09-25",
    rating: 5,
    text: "말로 안 한다. 그냥 이쁘다.",
  },
  {
    id: "r-012",
    author: "루피",
    date: "2025-09-26",
    rating: 5,
    text: "우와 너무 예뻐요. 대만족 👍",
  },
];

/* =========================================================
   MAIN PAGE
========================================================= */
export default function Page() {
  const [contactOpen, setContactOpen] = useState(false);

  // Reviews state (seed + localStorage)
  const [reviews, setReviews] = useState<Review[]>(seedReviews);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("miya.reviews");
      if (raw) {
        const parsed = JSON.parse(raw) as Review[];
        if (Array.isArray(parsed) && parsed.length) setReviews(parsed);
      }
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("miya.reviews", JSON.stringify(reviews));
    } catch {}
  }, [reviews]);

  // Review form
  const [nick, setNick] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const canSubmit = nick.trim().length > 0 && message.trim().length > 5;

  const submitReview = () => {
    if (!canSubmit) return;
    const entry: Review = {
      id: `r-${Date.now()}`,
      author: nick.trim(),
      date: new Date().toISOString().slice(0, 10),
      rating: clamp(rating, 1, 5),
      text: message.trim().slice(0, 2000),
    };
    setReviews((prev) => [entry, ...prev]);
    setNick("");
    setRating(5);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Navbar onContact={() => setContactOpen(true)} />
      <ContactDialog open={contactOpen} onOpenChange={setContactOpen} />

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-4 pt-12 pb-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs mb-4">
              <Star className="w-4 h-4" />
              디스코드 배너 · 로고 · 타이틀 전문
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              브랜드를 빛내는 시그니처 비주얼
            </h1>
            <p className="mt-4 text-neutral-600">
              배너, 포스터, 프로필, 로고, 칭호까지 — 깔끔하고 예쁜 무드로 빠르게
              제작해 드려요. 요청 → 견적 → 시안 → 피드백 → 납품까지 원스톱.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                className="rounded-2xl"
                onClick={() => setContactOpen(true)}
              >
                지금 의뢰하기
              </Button>
              <a
                href="#portfolio"
                className="inline-flex items-center gap-2 text-sm underline underline-offset-4"
              >
                포트폴리오 보기 <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="mt-6 flex items-center gap-6 text-sm text-neutral-500">
              <span className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                안전 결제 가이드 제공
              </span>
              <span className="flex items-center gap-2">
                <MessagesSquare className="w-4 h-4" />
                디스코드/카톡 커뮤니케이션
              </span>
            </div>
          </div>

          <div>
            <Placeholder label="Hero Showcase" ratio="pb-[66%]" />
          </div>
        </div>
      </section>

      {/* CATEGORIES QUICK GRID */}
      <Section
        id="portfolio"
        title="포트폴리오 카테고리"
        subtitle="필요한 작업 유형을 골라서 살펴보세요."
      >
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {["배너", "로고", "프로필", "포스터", "칭호"].map((c) => (
            <Card key={c} className="rounded-2xl hover:shadow-md transition">
              <CardContent className="p-3">
                <Placeholder label={c} ratio="pb-[75%]" />
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-medium">{c}</span>
                  <Button variant="secondary" size="sm" className="rounded-xl">
                    보기
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* GALLERY GRID */}
      <Section id="gallery" title="작업 갤러리" subtitle="썸네일을 눌러 상세 설명을 확인하세요.">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, i) => (
            <Card key={i} className="rounded-2xl overflow-hidden group">
              <div className="p-0">
                <Placeholder label={`Work #${i + 1}`} ratio="pb-[70%]" />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">프로젝트 {i + 1}</CardTitle>
                  <CardDescription className="text-xs">
                    컨셉 / 사용툴 / 납품형식
                  </CardDescription>
                </div>
                <Badge variant="secondary">2025</Badge>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Button variant="secondary" className="rounded-2xl">
            <GalleryHorizontalEnd className="w-4 h-4 mr-2" />
            더 보기
          </Button>
        </div>
      </Section>

      {/* SERVICES & PRICING (요약형) */}
      <Section
        id="services"
        title="서비스 & 기본 가격"
        subtitle="자세한 금액은 채팅 상담으로 빠르게 안내해 드려요."
      >
        {/* 항목별 시작가 */}
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { name: "로고", desc: "워드마크 · 심볼마크", price: "₩15,000~" },
            { name: "배너", desc: "디스코드/유튜브 맞춤", price: "₩15,000~" },
            { name: "포스터", desc: "이벤트/홍보", price: "₩15,000~" },
            { name: "프로필", desc: "투명 PNG, GIF 옵션", price: "₩10,000~" },
            { name: "칭호 / 킬피드", desc: "게임/방송 텍스트 그래픽", price: "₩15,000~" },
            { name: "영상", desc: "인트로/로고 애니메이션", price: "₩30,000~" },
          ].map((s) => (
            <Card key={s.name} className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{s.name}</span>
                  <span className="text-base font-medium text-neutral-500">
                    {s.price}
                  </span>
                </CardTitle>
                <CardDescription>{s.desc}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-neutral-600">
                기본 시안 1종 · 수정 2회 포함
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 정책 요약 + 상담 유도 */}
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">정책 요약</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm list-disc pl-4 text-neutral-600 space-y-1">
                <li>수정 2회 무료 · 이후 1회당 +5,000~10,000원</li>
                <li>빠른 납기(24~48h) : 총액 +30~50%</li>
                <li>소스파일(PSD/AE) 제공하지 않습니다</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">자세한 견적 상담</CardTitle>
              <CardDescription>채팅으로 빠르게 문의해 주세요.</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button asChild className="rounded-2xl">
                <a
                  href="https://open.kakao.com/o/slHj1bUh"
                  target="_blank"
                  rel="noreferrer"
                >
                  카카오톡 상담 <MessageCircle className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button asChild variant="secondary" className="rounded-2xl">
                <a
                  href="https://discord.gg/QPZnJcvAGG"
                  target="_blank"
                  rel="noreferrer"
                >
                  디스코드 상담 <MessagesSquare className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* PROCESS */}
      <Section
        id="process"
        title="작업 진행 프로세스"
        subtitle="명확한 커뮤니케이션으로 깔끔하게 진행합니다."
      >
        <div className="grid md:grid-cols-5 gap-4">
          {[
            { t: "문의", d: "요청사항/참고자료 전달", icon: Send },
            { t: "견적", d: "일정·금액 안내 및 확정", icon: CreditCard },
            { t: "시안", d: "1차 시안 공유", icon: ImageIcon },
            { t: "피드백", d: "수정 반영 (2회)", icon: MessagesSquare },
            { t: "납품", d: "최종 파일 전달", icon: ShieldCheck },
          ].map((step, i) => (
            <div
              key={i}
              className="flex flex-col items-start gap-3 p-4 rounded-2xl border"
            >
              <step.icon className="w-5 h-5" />
              <div className="font-medium">
                {i + 1}. {step.t}
              </div>
              <div className="text-sm text-neutral-600">{step.d}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* REVIEWS */}
      <Section id="reviews" title="클라이언트 후기">
        {/* 작성 폼 */}
        <Card className="rounded-2xl mb-6">
          <CardHeader>
            <CardTitle className="text-base">후기 작성</CardTitle>
            <CardDescription>
              실제 의뢰 경험을 간단히 남겨 주세요. (별점과 닉네임, 내용)
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="flex flex-col md:flex-row gap-3">
              <Input
                placeholder="닉네임"
                value={nick}
                onChange={(e) => setNick(e.target.value)}
                className="md:w-60"
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600">별점</span>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const idx = i + 1;
                    const active = idx <= rating;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setRating(idx)}
                        className="p-1"
                        aria-label={`별점 ${idx}`}
                        title={`별점 ${idx}`}
                      >
                        <Star
                          className={`w-5 h-5 ${
                            active ? "fill-amber-400 text-amber-400" : ""
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <Textarea
              placeholder="후기 내용을 입력해 주세요. (최대 2000자)"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500">
                저장은 브라우저 로컬에 보관됩니다.
              </span>
              <Button
                disabled={!canSubmit}
                onClick={submitReview}
                className="rounded-2xl"
              >
                후기 등록
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 후기 리스트 */}
        <div className="grid md:grid-cols-3 gap-4">
          {reviews.map((r) => (
            <Card key={r.id} className="rounded-2xl">
              <CardContent className="p-6 flex flex-col gap-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
                  <Quote className="inline w-4 h-4 mr-1" />
                  {r.text}
                </p>
                <div className="text-xs text-neutral-500">
                  — {r.author}
                  {r.date ? ` · ${r.date}` : ""}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" title="자주 묻는 질문">
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              q: "시안 수정은 몇 회까지 가능한가요?",
              a: "기본 2회까지 무료이며, 이후 추가 수정은 별도 비용이 발생합니다.",
            },
            {
              q: "결제는 어떻게 하나요?",
              a: "안전한 결제 가이드와 계좌/간편결제 옵션을 안내드립니다.",
            },
            {
              q: "원본 파일도 제공되나요?",
              a: "납품 시 PNG/JPG와 함께 필요 시 일부 원본 제공 가능합니다(상황에 따라 상이).",
            },
            {
              q: "상업적 사용이 가능한가요?",
              a: "네. 계약 범위 내에서 상업적 사용을 허용합니다.",
            },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-2xl border">
              <div className="font-medium mb-2">Q. {item.q}</div>
              <p className="text-sm text-neutral-600">{item.a}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA BAR */}
      <section className="bg-neutral-50 border-t">
        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xl font-semibold">
              지금 바로 예쁜 결과물, 깔끔하게 받아보세요
            </div>
            <div className="text-sm text-neutral-600">
              카카오톡/디스코드로 빠르게 상담해 드립니다.
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild className="rounded-2xl">
              <a
                href="https://open.kakao.com/o/slHj1bUh"
                target="_blank"
                rel="noreferrer"
              >
                카카오톡 문의 <MessageCircle className="w-4 h-4 ml-2" />
              </a>
            </Button>
            <Button asChild variant="secondary" className="rounded-2xl">
              <a
                href="https://discord.gg/QPZnJcvAGG"
                target="_blank"
                rel="noreferrer"
              >
                디스코드 문의 <MessagesSquare className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-xs text-neutral-500">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-2">
          <div>© 2025 MIYA DESIGN. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:opacity-80">
              이용약관
            </a>
            <a href="#" className="hover:opacity-80">
              개인정보처리방침
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
