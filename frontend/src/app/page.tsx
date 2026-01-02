'use client';

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useLanguage } from '@/contexts/LanguageContext'

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-br from-orange-600/10 via-primary/10 to-yellow-500/10">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                  ⚡ {t.hero.badge}
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-4 sm:mb-6 leading-tight">
                  {t.hero.title} <span className="text-primary">{t.hero.subtitle}</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-4 sm:mb-6 sm:mb-8">
                  {t.hero.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6 sm:mb-8">
                  <Link href="/courses" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8">
                      {t.hero.cta}
                    </Button>
                  </Link>
                  <Link href="/auth/register" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8">
                      {t.common.register}
                    </Button>
                  </Link>
                </div>
                <div className="flex flex-wrap gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground">
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-foreground">500+</div>
                    <div>{t.hero.students}</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-foreground">95%</div>
                    <div>{t.stats.employment}</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-foreground">4.9</div>
                    <div>{t.hero.rating}</div>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="relative -mt-8">
                  {/* Изображение Теслы */}
                  <img 
                    src="/images/tesla.png" 
                    alt="Nikola Tesla - Pioneer of Electricity"
                    className="w-full h-auto object-contain mx-auto scale-125"
                    loading="lazy"
                  />
                  
                  {/* Градиентный оверлей для читаемости */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none"></div>
                  
                  {/* Желтый бейдж "ТОП курс" */}
                  <div className="absolute top-6 right-6 bg-yellow-500 text-black px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 animate-pulse">
                    <span className="text-xl">⚡</span>
                    <span>ТОП курс</span>
                  </div>
                  
                  {/* Карточка со статистикой внизу */}
                  <div className="absolute -bottom-4 left-6 right-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl p-4 shadow-xl">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary">500+</div>
                        <div className="text-xs text-muted-foreground">Студентов</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">95%</div>
                        <div className="text-xs text-muted-foreground">Успех</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-600">4.9★</div>
                        <div className="text-xs text-muted-foreground">Рейтинг</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-8 sm:py-12 md:py-16 px-4 bg-primary text-primary-foreground">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">500+</div>
                <div className="text-xs sm:text-sm text-primary-foreground/80">{t.stats.students}</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">3+</div>
                <div className="text-xs sm:text-sm text-primary-foreground/80">{t.stats.courses}</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">200+</div>
                <div className="text-xs sm:text-sm text-primary-foreground/80">{t.stats.hours}</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">95%</div>
                <div className="text-xs sm:text-sm text-primary-foreground/80">{t.stats.employment}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{t.benefits.title}</h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
                {t.benefits.subtitle}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              <div className="bg-card p-6 sm:p-6 sm:p-8 rounded-xl border hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4 sm:mb-4 sm:mb-6">
                  <span className="text-2xl sm:text-2xl sm:text-3xl">🎓</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{t.benefits.practice.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{t.benefits.practice.description}</p>
              </div>
              <div className="bg-card p-6 sm:p-8 rounded-xl border hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <span className="text-3xl">👨‍🏫</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{t.benefits.expert.title}</h3>
                <p className="text-muted-foreground">{t.benefits.expert.description}</p>
              </div>
              <div className="bg-card p-6 sm:p-8 rounded-xl border hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <span className="text-3xl">📱</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{t.benefits.online.title}</h3>
                <p className="text-muted-foreground">{t.benefits.online.description}</p>
              </div>
              <div className="bg-card p-6 sm:p-8 rounded-xl border hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <span className="text-3xl">📜</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{t.benefits.certificate.title}</h3>
                <p className="text-muted-foreground">{t.benefits.certificate.description}</p>
              </div>
              <div className="bg-card p-6 sm:p-8 rounded-xl border hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500/10 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <span className="text-3xl">🎧</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{t.benefits.support.title}</h3>
                <p className="text-muted-foreground">{t.benefits.support.description}</p>
              </div>
              <div className="bg-card p-6 sm:p-8 rounded-xl border hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <span className="text-3xl">💼</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{t.benefits.job.title}</h3>
                <p className="text-muted-foreground">{t.benefits.job.description}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Curriculum Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{t.curriculum.title}</h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
                {t.curriculum.subtitle}
              </p>
            </div>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-card p-6 sm:p-8 rounded-xl border">
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2 whitespace-pre-line">{t.curriculum.module1.title}</h3>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>📚 {t.curriculum.module1.lessons}</span>
                      <span>⏱️ {t.curriculum.module1.duration}</span>
                    </div>
                  </div>
                </div>
                <ul className="space-y-3">
                  {t.curriculum.module1.topics.map((topic, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-0.5 sm:mt-1">▸</span>
                      <span className="text-sm sm:text-base">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-card p-6 sm:p-8 rounded-xl border">
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2 whitespace-pre-line">{t.curriculum.module2.title}</h3>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>📚 {t.curriculum.module2.lessons}</span>
                      <span>⏱️ {t.curriculum.module2.duration}</span>
                    </div>
                  </div>
                </div>
                <ul className="space-y-3">
                  {t.curriculum.module2.topics.map((topic, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">▸</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-card p-6 sm:p-8 rounded-xl border">
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2 whitespace-pre-line">{t.curriculum.module3.title}</h3>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>📚 {t.curriculum.module3.lessons}</span>
                      <span>⏱️ {t.curriculum.module3.duration}</span>
                    </div>
                  </div>
                </div>
                <ul className="space-y-3">
                  {t.curriculum.module3.topics.map((topic, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">▸</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-card p-6 sm:p-8 rounded-xl border">
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2 whitespace-pre-line">{t.curriculum.module4.title}</h3>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>📚 {t.curriculum.module4.lessons}</span>
                      <span>⏱️ {t.curriculum.module4.duration}</span>
                    </div>
                  </div>
                </div>
                <ul className="space-y-3">
                  {t.curriculum.module4.topics.map((topic, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">▸</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-card p-6 sm:p-8 rounded-xl border">
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2 whitespace-pre-line">{t.curriculum.module5.title}</h3>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>📚 {t.curriculum.module5.lessons}</span>
                      <span>⏱️ {t.curriculum.module5.duration}</span>
                    </div>
                  </div>
                </div>
                <ul className="space-y-3">
                  {t.curriculum.module5.topics.map((topic, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">▸</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Summary Block */}
              <div className="bg-gradient-to-br from-primary/10 to-yellow-500/10 border-2 border-primary rounded-xl p-6 sm:p-8 col-span-full">
                <div className="text-center">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">{t.curriculum.summary.title}</h3>
                  <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {t.curriculum.summary.modules.map((module, index) => (
                      <div key={index} className="bg-card/80 p-4 rounded-lg border">
                        <div className="flex items-center gap-2">
                          <span className="text-primary text-xl sm:text-2xl">✓</span>
                          <span className="font-semibold text-sm sm:text-base">{module}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground">{t.curriculum.summary.conclusion}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-br from-orange-50/50 to-yellow-50/50 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{t.pricing.title}</h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-4">{t.pricing.subtitle}</p>
            </div>
            
            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Premium Package */}
              <div className="bg-card border-2 border-primary rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow flex flex-col">
                <div className="mb-6 flex-grow">
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 text-primary">{t.pricing.premium.name}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="text-2xl sm:text-3xl font-bold text-foreground">{t.pricing.premium.priceFull}</div>
                    <div className="text-sm text-muted-foreground">{t.pricing.premium.priceWithout}</div>
                  </div>
                  <div className="font-semibold mb-3">{t.pricing.premium.includes}</div>
                  <ul className="space-y-2 mb-6">
                    {t.pricing.premium.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-1">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t pt-4 mt-auto">
                  <div className="font-semibold mb-3">{t.pricing.premium.lessonsTitle}</div>
                  <ul className="space-y-1.5 text-xs sm:text-sm mb-6">
                    {t.pricing.premium.lessons.map((lesson, index) => (
                      <li key={index} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary mt-1 text-xs">▸</span>
                        <span>{lesson}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/auth/register" className="block">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white" size="lg">
                      {t.pricing.premium.buyButton}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Promo Package */}
              <div className="bg-card border-2 border-orange-300 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow flex flex-col">
                <div className="mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 text-orange-600">{t.pricing.promo.name}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="text-lg sm:text-xl font-bold text-foreground">{t.pricing.promo.priceCash}</div>
                    <div className="text-lg sm:text-xl font-bold text-foreground">{t.pricing.promo.priceInstallment}</div>
                    <div className="text-sm text-muted-foreground">{t.pricing.promo.priceDiploma}</div>
                  </div>
                  <div className="font-semibold mb-3">{t.pricing.promo.includes}</div>
                  <ul className="space-y-2 mb-6">
                    {t.pricing.promo.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-orange-600 mt-1">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t pt-4 mt-auto">
                  <div className="font-semibold mb-2">{t.pricing.promo.lessonsTitle}</div>
                  <div className="text-xs text-muted-foreground mb-3 italic">{t.pricing.promo.lessonsNote}</div>
                  <ul className="space-y-1.5 text-xs sm:text-sm mb-6">
                    {t.pricing.promo.lessons.map((lesson, index) => (
                      <li key={index} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-orange-600 mt-1 text-xs">▸</span>
                        <span>{lesson}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/auth/register" className="block">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white" size="lg">
                      {t.pricing.promo.buyButton}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Econom Package */}
              <div className="bg-card border-2 border-gray-300 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow flex flex-col">
                <div className="mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold mb-4">{t.pricing.econom.name}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="text-lg sm:text-xl font-bold text-foreground">{t.pricing.econom.priceCash}</div>
                    <div className="text-lg sm:text-xl font-bold text-foreground">{t.pricing.econom.priceInstallment}</div>
                  </div>
                  <div className="font-semibold mb-3 text-red-600">{t.pricing.econom.notIncludes}</div>
                  <ul className="space-y-1.5 mb-6 text-sm">
                    {t.pricing.econom.notIncludesList.map((item, index) => (
                      <li key={index} className="text-muted-foreground">{item}</li>
                    ))}
                  </ul>
                  <div className="font-semibold mb-3">{t.pricing.econom.includes}</div>
                </div>
                <div className="border-t pt-4 mt-auto">
                  <ul className="space-y-1.5 text-xs sm:text-sm mb-6">
                    {t.pricing.econom.lessons.map((lesson, index) => (
                      <li key={index} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary mt-1 text-xs">▸</span>
                        <span>{lesson}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/auth/register" className="block">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white" size="lg">
                      {t.pricing.econom.buyButton}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{t.testimonials.title}</h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-4">{t.testimonials.subtitle}</p>
            </div>
            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              <div className="bg-card p-6 sm:p-8 rounded-xl border">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">⭐</span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 sm:mb-6">&quot;{t.testimonials.testimonial1.text}&quot;</p>
                <div>
                  <div className="font-semibold">{t.testimonials.testimonial1.name}</div>
                  <div className="text-sm text-muted-foreground">{t.testimonials.testimonial1.role}</div>
                </div>
              </div>

              <div className="bg-card p-6 sm:p-8 rounded-xl border">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">⭐</span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 sm:mb-6">&quot;{t.testimonials.testimonial2.text}&quot;</p>
                <div>
                  <div className="font-semibold">{t.testimonials.testimonial2.name}</div>
                  <div className="text-sm text-muted-foreground">{t.testimonials.testimonial2.role}</div>
                </div>
              </div>

              <div className="bg-card p-6 sm:p-8 rounded-xl border">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">⭐</span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 sm:mb-6">&quot;{t.testimonials.testimonial3.text}&quot;</p>
                <div>
                  <div className="font-semibold">{t.testimonials.testimonial3.name}</div>
                  <div className="text-sm text-muted-foreground">{t.testimonials.testimonial3.role}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-yellow-500/10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 sm:mb-6">{t.cta.title}</h2>
            <p className="text-xl text-muted-foreground mb-8">
              {t.cta.subtitle}
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8">
                {t.cta.button}
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-6">
              ✓ {t.cta.guarantee}
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
