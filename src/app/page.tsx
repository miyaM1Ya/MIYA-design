"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

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
  MessageCircle, // Kakao
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
   GAS 연결 (⬇️ 네 웹앱 배포 URL로 교체!)
========================================================= */
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbwx4YGUogU5nfvMEp5dfS7d2RojEhPV9QVYlM5bKhf8k_7mGhxCfhU-0xvi6v0ejuw/exec"; // <- 네 배포 URL
const SITE_ID = "miyadesign"; // 여러 프로젝트를 한 시트에 모을 때 구분용

/* 한 페이지에 보여줄 후기 개수 */
const PER_PAGE = 6;

/* =========================================================
   UTIL
========================================================= */
type Review = {
  id: string;
  author: string;
  date?: string;
  rating: number; // 1~5
  text: string;
};

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

function toDate(d?: string) {
  if (!d) return new Date(0);
  const t = Date.parse(d);
  return Number.isNaN(t) ? new Date(0) : new Date(t);
}

function sortByNewest(a: Review, b: Review) {
  const ta = toDate(a.date).getTime();
  const tb = toDate(b.date).getTime();
  if (ta !== tb) return tb - ta;
  return (b.id ?? "").localeCompare(a.id ?? "");
}

function isVideo(src: string) {
  return /\.(mp4|webm|mov)$/i.test(src);
}

/* =========================================================
   GAS 연동
========================================================= */
async function postReviewToGAS(r: { author: string; rating: number; text: string }) {
  try {
    await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        id: SITE_ID,
        author: r.author || "익명",
        rating: String(r.rating || 5),
        text: r.text || "",
      }),
    });
  } catch (err) {
    console.error("GAS post error:", err);
  }
}

async function fetchReviewsFromGAS(): Promise<Review[]> {
  try {
    const url = `${GAS_URL}?id=${encodeURIComponent(SITE_ID)}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as any;

    // 응답 호환: {ok, rows:[]} 또는 {ok, arr:[]} 또는 배열
    const rows =
      Array.isArray(data?.rows)
        ? data.rows
        : Array.isArray(data?.arr)
        ? data.arr
        : Array.isArray(data?.행)
        ? data.행
        : Array.isArray(data)
        ? data
        : [];

    const mapped: Review[] = rows.map((x: any, i: number) => ({
      id: `g-${i}-${x.date ?? ""}-${x.author ?? ""}`,
      author: String(x.author ?? "익명"),
      date: x.date ? String(x.date) : undefined,
      rating: Number(x.rating ?? 5),
      text: String(x.text ?? ""),
    }));

    mapped.sort(sortByNewest);
    return mapped;
  } catch (err) {
    console.error(err);
    return [];
  }
}

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
   카테고리 미리보기 (동영상/이미지 모두)
========================================================= */
function CategoryPreviewDialog({
  item,
  onClose,
}: {
  item: { name: string; thumb: string } | null;
  onClose: () => void;
}) {
  const open = !!item;
  const video = item ? isVideo(item.thumb) : false;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{item?.name ?? "미리보기"}</DialogTitle>
        </DialogHeader>

        <div className="relative w-full pb-[56%] rounded-xl overflow-hidden bg-neutral-100">
          {item &&
            (video ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video
                className="absolute inset-0 w-full h-full object-cover"
                src={item.thumb}
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="absolute inset-0 w-full h-full object-cover"
                src={item.thumb}
                alt={item.name}
              />
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */
export default function Page() {
  const [contactOpen, setContactOpen] = useState(false);

  // 후기
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);

  // 최초 로드: GAS에서 불러오기
  useEffect(() => {
    (async () => {
      const list = await fetchReviewsFromGAS();
      setReviews(list);
      setPage(1);
    })();
  }, []);

  // 작성 폼
  const [nick, setNick] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const canSubmit = nick.trim().length > 0 && message.trim().length > 5;

  // 등록
  const submitReview = async () => {
    if (!canSubmit) return;
    const entry: Review = {
      id: `r-${Date.now()}`,
      author: nick.trim(),
      date: new Date().toISOString().slice(0, 10),
      rating: clamp(rating, 1, 5),
      text: message.trim().slice(0, 2000),
    };

    // 화면에 즉시 반영
    setReviews((prev) => [entry, ...prev].sort(sortByNewest));
    setNick("");
    setRating(5);
    setMessage("");
    setPage(1);

    // 시트 저장 후 동기화
    postReviewToGAS({ author: entry.author, rating: entry.rating, text: entry.text });
    setTimeout(async () => {
      const list = await fetchReviewsFromGAS();
      if (list.length) setReviews(list);
    }, 800);
  };

  // 페이지네이션 계산
  const totalPages = Math.max(1, Math.ceil(reviews.length / PER_PAGE));
  const start = (page - 1) * PER_PAGE;
  const pagedReviews = reviews.slice(start, start + PER_PAGE);

  // 카테고리 미리보기
  const [catPreview, setCatPreview] = useState<{ name: string; thumb: string } | null>(null);

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
              배너, 포스터, 프로필, 로고, 칭호까지 — 깔끔하고 예쁜 무드로 빠르게 제작해 드려요.
              요청 → 견적 → 시안 → 피드백 → 납품까지 원스톱.
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

          <div className="relative w-full pb-[66%] rounded-2xl overflow-hidden bg-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero/hero.gif" // 파일명 바꿔도 됨
              alt="Hero Showcase"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ================== PORTFOLIO CATEGORIES ================== */}
      <Section
        id="portfolio"
        title="포트폴리오 카테고리"
        subtitle="필요한 작업 유형을 골라서 살펴보세요. 자세한 포트폴리오는 디스코드에서 확인하실 수 있어요."
      >
        {/* 카테고리 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: "배너",   thumb: "/images/categories/benner.gif"  },
            { name: "로고",   thumb: "/images/categories/logo.gif"    },
            { name: "프로필", thumb: "/images/categories/profile.gif" },
            { name: "포스터", thumb: "/images/categories/poster.gif"  },
            { name: "칭호",   thumb: "/images/categories/title.mp4"   }, // mp4도 지원
          ].map((c) => (
            <Card key={c.name} className="rounded-2xl hover:shadow-md transition">
              <CardContent className="p-3">
                <button
                  type="button"
                  className="relative w-full pb-[75%] overflow-hidden rounded-2xl bg-neutral-100"
                  onClick={() => setCatPreview(c)}
                  title={`${c.name} 미리보기`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {!isVideo(c.thumb) ? (
                    <img
                      src={c.thumb}
                      alt={c.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    // eslint-disable-next-line jsx-a11y/media-has-caption
                    <video
                      className="absolute inset-0 w-full h-full object-cover"
                      src={c.thumb}
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  )}
                </button>

                <div className="mt-3 flex items-center justify-between">
                  <span className="font-medium">{c.name}</span>
                  <Button size="sm" variant="secondary" className="rounded-xl" onClick={() => setCatPreview(c)}>
                    보기
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 디스코드 안내 박스 */}
        <div className="mt-6 p-4 rounded-2xl border flex items-center justify-between gap-3">
          <p className="text-sm text-neutral-600">
            전체/상세 포트폴리오는 디스코드 서버에서 더 편하게 확인하실 수 있어요.
          </p>
          <Button asChild className="rounded-2xl">
            <a href="https://discord.gg/QPZnJcvAGG" target="_blank" rel="noreferrer">
              디스코드에서 보기 <MessagesSquare className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </Section>

      {/* ================== SERVICES & PRICING ================== */}
      <Section
        id="services"
        title="서비스 & 기본 가격"
        subtitle="자세한 금액은 채팅 상담으로 빠르게 안내해 드려요."
      >
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

      {/* ================== PROCESS ================== */}
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

      {/* ================== REVIEWS ================== */}
      <Section id="reviews" title="클라이언트 후기">
        {/* 작성 폼 */}
        <Card className="rounded-2xl mb-6">
          <CardHeader>
            <CardTitle className="text-base">후기 작성</CardTitle>
            <CardDescription>
              실제 의뢰 경험을 간단히 남겨 주세요. (별점·닉네임·내용)
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
                등록 즉시 화면에 보이고, 서버에도 저장돼요.
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

        {/* 후기 리스트 + 페이지네이션 */}
        <div className="grid md:grid-cols-3 gap-4">
          {pagedReviews.map((r) => (
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

        <div className="mt-6 flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-xl"
          >
            이전
          </Button>

          {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
            const p = i + 1;
            return (
              <Button
                key={p}
                size="sm"
                variant={p === page ? "default" : "outline"}
                onClick={() => setPage(p)}
                className="rounded-xl"
              >
                {p}
              </Button>
            );
          })}
          {totalPages > 5 && (
            <>
              <span className="px-1 text-neutral-400">…</span>
              <Button
                size="sm"
                variant={page === totalPages ? "default" : "outline"}
                onClick={() => setPage(totalPages)}
                className="rounded-xl"
              >
                {totalPages}
              </Button>
            </>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded-xl"
          >
            다음
          </Button>
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

      {/* 카테고리 미리보기 모달 */}
      <CategoryPreviewDialog item={catPreview} onClose={() => setCatPreview(null)} />
    </div>
  );
}
