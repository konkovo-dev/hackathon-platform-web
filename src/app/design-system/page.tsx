import { Button } from '@/shared/ui/Button'
import { Card, CardContent, CardHeader } from '@/shared/ui/Card'
import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/Label'
import { Typography } from '@/shared/ui/Typography'
import { ThemeToggle } from '@/shared/ui/ThemeToggle'
import Link from 'next/link'

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-bg-default p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Typography variant="display-xl" className="mb-2">
              Design System
            </Typography>
            <Typography variant="body-md-regular" className="text-text-secondary">
              Компоненты дизайн-системы Hackathon Platform
            </Typography>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/"
              className="typography-body-md-medium text-link-default hover:text-link-hover"
            >
              На главную
            </Link>
          </div>
        </div>

        <div className="space-y-12">
          {/* Buttons */}
          <section>
            <Typography variant="heading-lg" className="mb-6">
              Buttons
            </Typography>

            <div className="space-y-8">
              {/* Primary Buttons */}
              <Card>
                <CardHeader>
                  <Typography variant="title-md">Primary</Typography>
                  <Typography variant="body-sm-regular" className="text-text-secondary">
                    Основная кнопка. При hover/active меняется только фон.
                  </Typography>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-4">
                    <Button variant="primary" size="sm">
                      Small
                    </Button>
                    <Button variant="primary" size="md">
                      Medium
                    </Button>
                    <Button variant="primary" size="lg">
                      Large
                    </Button>
                    <Button variant="primary" disabled>
                      Disabled
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Secondary Buttons */}
              <Card>
                <CardHeader>
                  <Typography variant="title-md">Secondary</Typography>
                  <Typography variant="body-sm-regular" className="text-text-secondary">
                    Вторичная кнопка. При hover/active меняется цвет обводки и текста (secondary →
                    primary).
                  </Typography>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-4">
                    <Button variant="secondary" size="sm">
                      Small
                    </Button>
                    <Button variant="secondary" size="md">
                      Medium
                    </Button>
                    <Button variant="secondary" size="lg">
                      Large
                    </Button>
                    <Button variant="secondary" disabled>
                      Disabled
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardHeader>
                  <Typography variant="title-md">Action</Typography>
                  <Typography variant="body-sm-regular" className="text-text-secondary">
                    Кнопка действия с иконкой &gt;. При hover/active меняется только фон.
                  </Typography>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-4">
                    <Button variant="action" size="sm">
                      Далее
                    </Button>
                    <Button variant="action" size="md">
                      Далее
                    </Button>
                    <Button variant="action" size="lg">
                      Далее
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Secondary Action Buttons */}
              <Card>
                <CardHeader>
                  <Typography variant="title-md">Secondary Action</Typography>
                  <Typography variant="body-sm-regular" className="text-text-secondary">
                    Вторичная кнопка действия с иконкой /. При hover/active меняется цвет обводки
                    и текста.
                  </Typography>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-4">
                    <Button variant="secondary-action" size="sm">
                      Назад
                    </Button>
                    <Button variant="secondary-action" size="md">
                      Назад
                    </Button>
                    <Button variant="secondary-action" size="lg">
                      Назад
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Typography */}
          <section>
            <Typography variant="heading-lg" className="mb-6">
              Typography
            </Typography>

            <Card>
              <CardContent className="space-y-6">
                <div>
                  <Typography variant="display-2xl" className="mb-2">
                    Display 2XL Semibold
                  </Typography>
                  <Typography variant="caption-sm-regular" className="text-text-tertiary">
                    typography-display-2xl
                  </Typography>
                </div>

                <div>
                  <Typography variant="display-xl" className="mb-2">
                    Display XL Semibold
                  </Typography>
                  <Typography variant="caption-sm-regular" className="text-text-tertiary">
                    typography-display-xl
                  </Typography>
                </div>

                <div>
                  <Typography variant="heading-lg" className="mb-2">
                    Heading Large Semibold
                  </Typography>
                  <Typography variant="caption-sm-regular" className="text-text-tertiary">
                    typography-heading-lg
                  </Typography>
                </div>

                <div>
                  <Typography variant="heading-md" className="mb-2">
                    Heading Medium Semibold
                  </Typography>
                  <Typography variant="caption-sm-regular" className="text-text-tertiary">
                    typography-heading-md
                  </Typography>
                </div>

                <div>
                  <Typography variant="heading-sm" className="mb-2">
                    Heading Small Semibold
                  </Typography>
                  <Typography variant="caption-sm-regular" className="text-text-tertiary">
                    typography-heading-sm
                  </Typography>
                </div>

                <div>
                  <Typography variant="title-lg" className="mb-2">
                    Title Large Semibold
                  </Typography>
                  <Typography variant="caption-sm-regular" className="text-text-tertiary">
                    typography-title-lg
                  </Typography>
                </div>

                <div>
                  <Typography variant="title-md" className="mb-2">
                    Title Medium Semibold
                  </Typography>
                  <Typography variant="caption-sm-regular" className="text-text-tertiary">
                    typography-title-md
                  </Typography>
                </div>

                <div>
                  <Typography variant="title-sm" className="mb-2">
                    Title Small Semibold
                  </Typography>
                  <Typography variant="caption-sm-regular" className="text-text-tertiary">
                    typography-title-sm
                  </Typography>
                </div>

                <div>
                  <Typography variant="body-lg-regular" className="mb-2">
                    Body Large Regular
                  </Typography>
                  <Typography variant="caption-sm-regular" className="text-text-tertiary">
                    typography-body-lg-regular
                  </Typography>
                </div>

                <div>
                  <Typography variant="body-lg-medium" className="mb-2">
                    Body Large Medium
                  </Typography>
                  <Typography variant="caption-sm-regular" className="text-text-tertiary">
                    typography-body-lg-medium
                  </Typography>
                </div>

                <div>
                  <Typography variant="body-md-regular" className="mb-2">
                    Body Medium Regular
                  </Typography>
                  <Typography variant="caption-sm-regular" className="text-text-tertiary">
                    typography-body-md-regular
                  </Typography>
                </div>

                <div>
                  <Typography variant="body-md-medium" className="mb-2">
                    Body Medium Medium
                  </Typography>
                  <Typography variant="caption-sm-regular" className="text-text-tertiary">
                    typography-body-md-medium
                  </Typography>
                </div>

                <div>
                  <Typography variant="body-sm-regular" className="mb-2">
                    Body Small Regular
                  </Typography>
                  <Typography variant="caption-sm-regular" className="text-text-tertiary">
                    typography-body-sm-regular
                  </Typography>
                </div>

                <div>
                  <Typography variant="body-sm-medium" className="mb-2">
                    Body Small Medium
                  </Typography>
                  <Typography variant="caption-sm-regular" className="text-text-tertiary">
                    typography-body-sm-medium
                  </Typography>
                </div>

                <div>
                  <Typography variant="label-lg" className="mb-2">
                    Label Large Medium
                  </Typography>
                  <Typography variant="caption-sm-regular" className="text-text-tertiary">
                    typography-label-lg
                  </Typography>
                </div>

                <div>
                  <Typography variant="label-md" className="mb-2">
                    Label Medium Medium
                  </Typography>
                  <Typography variant="caption-sm-regular" className="text-text-tertiary">
                    typography-label-md
                  </Typography>
                </div>

                <div>
                  <Typography variant="label-sm" className="mb-2">
                    Label Small Medium
                  </Typography>
                  <Typography variant="caption-sm-regular" className="text-text-tertiary">
                    typography-label-sm
                  </Typography>
                </div>

                <div>
                  <Typography variant="label-xs" className="mb-2">
                    Label XS Semibold
                  </Typography>
                  <Typography variant="caption-sm-regular" className="text-text-tertiary">
                    typography-label-xs
                  </Typography>
                </div>

                <div>
                  <Typography variant="caption-sm-regular" className="mb-2">
                    Caption Small Regular
                  </Typography>
                  <Typography variant="caption-sm-regular" className="text-text-tertiary">
                    typography-caption-sm-regular
                  </Typography>
                </div>

                <div>
                  <Typography variant="caption-sm-medium" className="mb-2">
                    Caption Small Medium
                  </Typography>
                  <Typography variant="caption-sm-regular" className="text-text-tertiary">
                    typography-caption-sm-medium
                  </Typography>
                </div>

                <div>
                  <Typography variant="caption-xs" className="mb-2">
                    Caption XS Regular
                  </Typography>
                  <Typography variant="caption-sm-regular" className="text-text-tertiary">
                    typography-caption-xs
                  </Typography>
                </div>

                <div>
                  <Typography variant="overline-xs" className="mb-2">
                    Overline XS Semibold
                  </Typography>
                  <Typography variant="caption-sm-regular" className="text-text-tertiary">
                    typography-overline-xs
                  </Typography>
                </div>

                <div>
                  <Typography variant="code-sm" className="mb-2">
                    Code Small Regular
                  </Typography>
                  <Typography variant="caption-sm-regular" className="text-text-tertiary">
                    typography-code-sm
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Form Elements */}
          <section>
            <Typography variant="heading-lg" className="mb-6">
              Form Elements
            </Typography>

            <Card>
              <CardHeader>
                <Typography variant="title-md">Input & Label</Typography>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="input-default">Default Input</Label>
                  <Input id="input-default" placeholder="Введите текст..." />
                </div>
                <div>
                  <Label htmlFor="input-disabled">Disabled Input</Label>
                  <Input id="input-disabled" placeholder="Отключено" disabled />
                </div>
                <div>
                  <Label htmlFor="input-email">Email Input</Label>
                  <Input id="input-email" type="email" placeholder="example@mail.com" />
                </div>
                <div>
                  <Label htmlFor="input-password">Password Input</Label>
                  <Input id="input-password" type="password" placeholder="••••••••" />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Colors */}
          <section>
            <Typography variant="heading-lg" className="mb-6">
              Colors
            </Typography>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Brand Colors */}
              <Card>
                <CardHeader>
                  <Typography variant="title-md">Brand Colors</Typography>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-md bg-brand-primary"></div>
                    <div>
                      <Typography variant="body-sm-medium">brand-primary</Typography>
                      <Typography variant="caption-sm-regular" className="text-text-tertiary">
                        Primary brand color
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-md bg-brand-secondary"></div>
                    <div>
                      <Typography variant="body-sm-medium">brand-secondary</Typography>
                      <Typography variant="caption-sm-regular" className="text-text-tertiary">
                        Secondary brand color
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-md bg-brand-accent"></div>
                    <div>
                      <Typography variant="body-sm-medium">brand-accent</Typography>
                      <Typography variant="caption-sm-regular" className="text-text-tertiary">
                        Accent color
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Text Colors */}
              <Card>
                <CardHeader>
                  <Typography variant="title-md">Text Colors</Typography>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Typography variant="body-sm-medium" className="text-text-primary">
                      text-primary
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="body-sm-medium" className="text-text-secondary">
                      text-secondary
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="body-sm-medium" className="text-text-tertiary">
                      text-tertiary
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="body-sm-medium" className="text-text-disabled">
                      text-disabled
                    </Typography>
                  </div>
                </CardContent>
              </Card>

              {/* State Colors */}
              <Card>
                <CardHeader>
                  <Typography variant="title-md">State Colors</Typography>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-state-success"></div>
                    <Typography variant="body-sm-medium">state-success</Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-state-warning"></div>
                    <Typography variant="body-sm-medium">state-warning</Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-state-error"></div>
                    <Typography variant="body-sm-medium">state-error</Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-state-info"></div>
                    <Typography variant="body-sm-medium">state-info</Typography>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
