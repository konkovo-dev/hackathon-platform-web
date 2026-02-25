import { Button } from '@/shared/ui/Button'
import { Card, CardContent, CardHeader } from '@/shared/ui/Card'
import { Checkbox } from '@/shared/ui/Checkbox'
import { FormField } from '@/shared/ui/FormField'
import { Icon } from '@/shared/ui/Icon'
import { Input } from '@/shared/ui/Input'
import { InputLabel } from '@/shared/ui/InputLabel'
import { Label } from '@/shared/ui/Label'
import { Logo } from '@/shared/ui/Logo'
import { MenuItem } from '@/shared/ui/MenuItem'
import { Radio } from '@/shared/ui/Radio'
import { Switch } from '@/shared/ui/Switch'
import { Typography } from '@/shared/ui/Typography'
import Link from 'next/link'

export default function DesignSystemPage() {
  return (
    <div className="container mx-auto max-w-7xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <Typography variant="display-xl">Design System</Typography>
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
                </div>

                <div>
                  <Typography variant="display-xl" className="mb-2">
                    Display XL Semibold
                  </Typography>
                </div>

                <div>
                  <Typography variant="heading-lg" className="mb-2">
                    Heading Large Semibold
                  </Typography>
                </div>

                <div>
                  <Typography variant="heading-md" className="mb-2">
                    Heading Medium Semibold
                  </Typography>
                </div>

                <div>
                  <Typography variant="heading-sm" className="mb-2">
                    Heading Small Semibold
                  </Typography>
                </div>

                <div>
                  <Typography variant="title-lg" className="mb-2">
                    Title Large Semibold
                  </Typography>
                </div>

                <div>
                  <Typography variant="title-md" className="mb-2">
                    Title Medium Semibold
                  </Typography>
                </div>

                <div>
                  <Typography variant="title-sm" className="mb-2">
                    Title Small Semibold
                  </Typography>
                </div>

                <div>
                  <Typography variant="body-lg-regular" className="mb-2">
                    Body Large Regular
                  </Typography>
                </div>

                <div>
                  <Typography variant="body-lg-medium" className="mb-2">
                    Body Large Medium
                  </Typography>
                </div>

                <div>
                  <Typography variant="body-md-regular" className="mb-2">
                    Body Medium Regular
                  </Typography>
                </div>

                <div>
                  <Typography variant="body-md-medium" className="mb-2">
                    Body Medium Medium
                  </Typography>
                </div>

                <div>
                  <Typography variant="body-sm-regular" className="mb-2">
                    Body Small Regular
                  </Typography>
                </div>

                <div>
                  <Typography variant="body-sm-medium" className="mb-2">
                    Body Small Medium
                  </Typography>
                </div>

                <div>
                  <Typography variant="label-lg" className="mb-2">
                    Label Large Medium
                  </Typography>
                </div>

                <div>
                  <Typography variant="label-md" className="mb-2">
                    Label Medium Medium
                  </Typography>
                </div>

                <div>
                  <Typography variant="label-sm" className="mb-2">
                    Label Small Medium
                  </Typography>
                </div>

                <div>
                  <Typography variant="label-xs" className="mb-2">
                    Label XS Semibold
                  </Typography>
                </div>

                <div>
                  <Typography variant="caption-sm-regular" className="mb-2">
                    Caption Small Regular
                  </Typography>
                </div>

                <div>
                  <Typography variant="caption-sm-medium" className="mb-2">
                    Caption Small Medium
                  </Typography>
                </div>

                <div>
                  <Typography variant="caption-xs" className="mb-2">
                    Caption XS Regular
                  </Typography>
                </div>

                <div>
                  <Typography variant="overline-xs" className="mb-2">
                    Overline XS Semibold
                  </Typography>
                </div>

                <div>
                  <Typography variant="code-sm" className="mb-2">
                    Code Small Regular
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

            <div className="space-y-6">
              {/* Text Input */}
              <Card>
                <CardHeader>
                  <Typography variant="title-md">Text Input</Typography>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="input-text-default">Default</Label>
                    <Input id="input-text-default" variant="text" placeholder="Введите текст..." />
                  </div>
                  <div>
                    <Label htmlFor="input-text-filled">Filled</Label>
                    <Input id="input-text-filled" variant="text" defaultValue="Введенный текст" />
                  </div>
                  <div>
                    <Label htmlFor="input-text-error">With Error</Label>
                    <Input id="input-text-error" variant="text" error placeholder="Ошибка валидации" />
                  </div>
                  <div>
                    <Label htmlFor="input-text-disabled">Disabled</Label>
                    <Input id="input-text-disabled" variant="text" placeholder="Отключено" disabled />
                  </div>
                </CardContent>
              </Card>

              {/* Search Input */}
              <Card>
                <CardHeader>
                  <Typography variant="title-md">Search Input</Typography>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="input-search-default">Default</Label>
                    <Input id="input-search-default" variant="search" placeholder="Поиск..." />
                  </div>
                  <div>
                    <Label htmlFor="input-search-filled">Filled</Label>
                    <Input id="input-search-filled" variant="search" defaultValue="Результаты поиска" />
                  </div>
                </CardContent>
              </Card>

              {/* Checkbox */}
              <Card>
                <CardHeader>
                  <Typography variant="title-md">Checkbox</Typography>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Checkbox label="Не выбранный чекбокс" />
                  <Checkbox label="Выбранный чекбокс" defaultChecked />
                  <Checkbox label="Отключенный" disabled />
                  <Checkbox label="Отключенный выбранный" defaultChecked disabled />
                </CardContent>
              </Card>

              {/* Radio */}
              <Card>
                <CardHeader>
                  <Typography variant="title-md">Radio</Typography>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Radio name="radio-group" label="Вариант 1" />
                  <Radio name="radio-group" label="Вариант 2" defaultChecked />
                  <Radio name="radio-group-disabled" label="Отключенный" disabled />
                  <Radio name="radio-group-disabled" label="Отключенный выбранный" defaultChecked disabled />
                </CardContent>
              </Card>

              {/* Switch */}
              <Card>
                <CardHeader>
                  <Typography variant="title-md">Switch</Typography>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-3">
                    <Switch />
                    <Typography variant="body-sm-regular" className="text-text-secondary">
                      Default
                    </Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch defaultChecked />
                    <Typography variant="body-sm-regular" className="text-text-secondary">
                      Checked
                    </Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch disabled />
                    <Typography variant="body-sm-regular" className="text-text-secondary">
                      Disabled
                    </Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch defaultChecked disabled />
                    <Typography variant="body-sm-regular" className="text-text-secondary">
                      Disabled checked
                    </Typography>
                  </div>
                </CardContent>
              </Card>

              {/* InputLabel */}
              <Card>
                <CardHeader>
                  <Typography variant="title-md">InputLabel</Typography>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <InputLabel label="Email" inputPlaceholder="Введите email" inputType="email" />
                  <InputLabel label="Password" inputPlaceholder="Введите пароль" inputType="password" />
                </CardContent>
              </Card>

              {/* FormField */}
              <Card>
                <CardHeader>
                  <Typography variant="title-md">FormField</Typography>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField label="Username" labelFor="ff-username">
                    <Input id="ff-username" variant="text" />
                  </FormField>
                  <FormField label="Username" labelFor="ff-username-error" error="Validation error">
                    <Input id="ff-username-error" variant="text" error />
                  </FormField>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Branding */}
          <section>
            <Typography variant="heading-lg" className="mb-6">
              Branding
            </Typography>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <Typography variant="title-md">Logo</Typography>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-6">
                  <Logo size="md" />
                  <Logo size="sm" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Typography variant="title-md">Icon</Typography>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-3">
                    <Icon src="/icons/icon-profile/icon-profile-md.svg" size="sm" />
                    <Typography variant="body-sm-regular" className="text-text-secondary">
                      sm
                    </Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon src="/icons/icon-profile/icon-profile-md.svg" size="md" />
                    <Typography variant="body-sm-regular" className="text-text-secondary">
                      md
                    </Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon src="/icons/icon-profile/icon-profile-md.svg" size="lg" />
                    <Typography variant="body-sm-regular" className="text-text-secondary">
                      lg
                    </Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon src="/icons/icon-settings/icon-settings-md.svg" size="md" color="secondary" />
                    <Typography variant="body-sm-regular" className="text-text-secondary">
                      secondary
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Navigation */}
          <section>
            <Typography variant="heading-lg" className="mb-6">
              Navigation
            </Typography>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <Typography variant="title-md">MenuItem</Typography>
                </CardHeader>
                <CardContent className="space-y-3">
                  <MenuItem
                    href="/hackathons"
                    iconSrc="/icons/icon-search/icon-search-md.svg"
                    title="hackathons"
                    active
                  />
                  <MenuItem href="/profile" iconSrc="/icons/icon-profile/icon-profile-md.svg" title="profile" />
                  <MenuItem
                    href="/my-teams"
                    iconSrc="/icons/icon-team/iton-team-md.svg"
                    title="my teams"
                    collapsed
                  />
                </CardContent>
              </Card>
            </div>
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
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-md bg-brand-secondary"></div>
                    <div>
                      <Typography variant="body-sm-medium">brand-secondary</Typography>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-md bg-brand-accent"></div>
                    <div>
                      <Typography variant="body-sm-medium">brand-accent</Typography>
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
  )
}
