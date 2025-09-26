"use client";

import { useState } from "react";
import {
  Menu,
  X,
  Image as ImageIcon,
  MessagesSquare,
  Star,
  CreditCard,
  ShieldCheck,
  Send,
  Quote,
  Sparkles,
  PhoneCall,
  Mail,
  ArrowRight,
  GalleryHorizontalEnd,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
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

// --- SIMPLE PLACEHOLDER IMAGE BLOCK ---
function Placeholder({ label = "Preview", ratio = "pb-[56%]" }: { label?: string; ratio?: string }) {
  return (
    <div className={`w-full ${ratio} relative bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl`}>
      <div className="absolute inset-0 flex items-center justify-center gap-2 text-neutral-500">
        <ImageIcon className="w-5 h-5" />
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
}

// --- NAVBAR ---
function Navbar({ onContact }: { onContact: () => void }) {
  const [open, setOpen] = useState(false);
  const nav = [
    { name: "Portfolio", href: "#portfolio" },
    { name: "Services & Pricing", href: "#services" },
    { name: "Process", href: "#process" },
    { name: "Reviews", href: "#reviews" },
    { name: "FAQ", href: "#faq" },
  ];
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
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {/* mobile menu */}
      <div className={`md:hidden transition-[max-height] duration-300 overflow-hidden ${open ? "max-h-96" : "max-h-0"}`}>
        <div className="px-4 pb-4 flex flex-col gap-3">
          <a href="#portfolio" onClick={() => setOpen(false)}>
            Portfolio
          </a>
          <a href="#services" onClick={() => setOpen(false)}>
            Services & Pricing
          </a>
          <a href="#process" onClick={() => setOpen(false)}>
            Process
          </a>
          <a href="#reviews" onClick={() => setOpen(false)}>
            Reviews
          </a>
          <a href="#faq" onClick={() => setOpen(false)}>
            FAQ
          </a>
          <Button
            onClick={() => {
              setOpen(false);
              onContact();
            }}
            className="rounded-2xl"
          >
            문의 / 의뢰하기
          </Button>
        </div>
      </div>
    </header>
  );
}

// --- CONTACT DIALOG (Inquiry Links) ---
// 폼 대신 "링크로 문의" — 메일/디스코드 버튼만 제공
function ContactDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>의뢰/문의</DialogTitle>
          <DialogDescription>원하는 채널로 편하게 연락 주세요.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input placeholder="이름 또는 닉네임 (선택)" />
            <Input placeholder="요청 작업 (배너/로고/프로필/포스터/칭호)" />
          </div>
          <Textarea rows={4} placeholder="요청사항 메모(선택) — 보관용, 전송 기능은 없어요." />
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              연락은 외부 채널로 진행됩니다.
            </span>
            <div className="flex gap-2">
              <Button asChild className="rounded-2xl">
                <a href="mailto:hello@yourdomain.com">
                  이메일 문의 <Mail className="w-4 h-4 ml-1" />
                </a>
              </Button>
              <Button asChild variant="secondary" className="rounded-2xl">
                <a href="https://discord.com/users/000000000000000000" target="_blank" rel="noreferrer">
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

// --- SECTION WRAPPER ---
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
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="text-neutral-500 mt-2">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

// --- MAIN PAGE ---
export default function StudioWireframe() {
  const [contactOpen, setContactOpen] = useState(false);

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
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">브랜드를 빛내는 시그니처 비주얼</h1>
            <p className="mt-4 text-neutral-600">
              배너, 포스터, 프로필, 로고, 칭호까지 — 깔끔하고 예쁜 무드로 빠르게 제작해 드려요. 요청 → 견적 → 시안 → 피드백 →
              납품까지 원스톱.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="rounded-2xl" onClick={() => setContactOpen(true)}>
                지금 의뢰하기
              </Button>
              <a href="#portfolio" className="inline-flex items-center gap-2 text-sm underline underline-offset-4">
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
      <Section id="portfolio" title="포트폴리오 카테고리" subtitle="필요한 작업 유형을 골라서 살펴보세요.">
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
                  <CardDescription className="text-xs">컨셉 / 사용툴 / 납품형식</CardDescription>
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

      {/* SERVICES & PRICING */}
      <Section id="services" title="서비스 & 기본 가격" subtitle="구체 견적은 요청 내용을 확인 후 안내됩니다.">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { name: "배너", desc: "디스코드/유튜브 등 맞춤 사이즈", price: "₩35,000~" },
            { name: "로고", desc: "워드마크 · 심볼마크", price: "₩60,000~" },
            { name: "프로필/칭호", desc: "투명 PNG, GIF 옵션", price: "₩25,000~" },
          ].map((s) => (
            <Card key={s.name} className="rounded-2xl">
              <CardHeader>
                <CardTitle>{s.name}</CardTitle>
                <CardDescription>{s.desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="text-sm list-disc pl-4 text-neutral-600">
                  <li>기본 시안 1종 + 수정 2회</li>
                  <li>원본/웹용 파일 제공</li>
                  <li>급행 옵션 가능</li>
                </ul>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{s.price}</span>
                  <Button className="rounded-2xl" onClick={() => window?.scrollTo({ top: 0, behavior: "smooth" })}>
                    의뢰하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* PROCESS */}
      <Section id="process" title="작업 진행 프로세스" subtitle="명확한 커뮤니케이션으로 깔끔하게 진행합니다.">
        <div className="grid md:grid-cols-5 gap-4">
          {[
            { t: "문의", d: "요청사항/참고자료 전달", icon: Send },
            { t: "견적", d: "일정·금액 안내 및 확정", icon: CreditCard },
            { t: "시안", d: "1차 시안 공유", icon: ImageIcon },
            { t: "피드백", d: "수정 반영 (2회)", icon: MessagesSquare },
            { t: "납품", d: "최종 파일 전달", icon: ShieldCheck },
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-start gap-3 p-4 rounded-2xl border">
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
        <div className="grid md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="rounded-2xl">
              <CardContent className="p-6 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-amber-500">
                  {Array.from({ length: 5 }).map((__, j) => (
                    <Star key={j} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  <Quote className="inline w-4 h-4 mr-1" /> 빠르게 소통해 주시고 결과물도 정말 예뻤어요. 다음에도 의뢰하고 싶어요!
                </p>
                <div className="text-xs text-neutral-500">— 디스코드 @client{i + 1}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" title="자주 묻는 질문">
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { q: "시안 수정은 몇 회까지 가능한가요?", a: "기본 2회까지 무료이며, 이후 추가 수정은 별도 비용이 발생합니다." },
            { q: "결제는 어떻게 하나요?", a: "안전한 결제 가이드와 계좌/간편결제 옵션을 안내드립니다." },
            { q: "원본 파일도 제공되나요?", a: "납품 시 PNG/JPG와 함께 필요 시 원본(AI/PSD) 제공 가능합니다." },
            { q: "상업적 사용이 가능한가요?", a: "네. 계약 범위 내에서 상업적 사용을 허용합니다." },
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
            <div className="text-xl font-semibold">지금 바로 예쁜 결과물, 깔끔하게 받아보세요</div>
            <div className="text-sm text-neutral-600">디스코드/카톡으로 빠르게 상담해 드립니다.</div>
          </div>
          <div className="flex items-center gap-3">
            <Button className="rounded-2xl" onClick={() => setContactOpen(true)}>
              문의하기 <MessagesSquare className="w-4 h-4 ml-2" />
            </Button>
            <a href="mailto:hello@yourdomain.com" className="text-sm underline underline-offset-4 flex items-center gap-2">
              <Mail className="w-4 h-4" /> 이메일
            </a>
            <a href="tel:+821012345678" className="text-sm underline underline-offset-4 flex items-center gap-2">
              <PhoneCall className="w-4 h-4" /> 전화
            </a>
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
