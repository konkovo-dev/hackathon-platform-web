import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export interface MarkdownContentProps {
  children: string
  className?: string
}

export function MarkdownContent({ children, className = '' }: MarkdownContentProps) {
  return (
    <div className={cn('markdown-content', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1
              className="typography-heading-lg text-text-primary mb-m6 mt-m8 first:mt-0"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="typography-heading-md text-text-primary mb-m5 mt-m7 first:mt-0"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="typography-heading-sm text-text-primary mb-m4 mt-m6 first:mt-0"
              {...props}
            />
          ),
          h4: ({ node, ...props }) => (
            <h4
              className="typography-title-lg text-text-primary mb-m4 mt-m5 first:mt-0"
              {...props}
            />
          ),
          h5: ({ node, ...props }) => (
            <h5
              className="typography-title-md text-text-primary mb-m3 mt-m5 first:mt-0"
              {...props}
            />
          ),
          h6: ({ node, ...props }) => (
            <h6
              className="typography-title-sm text-text-primary mb-m3 mt-m4 first:mt-0"
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p
              className="typography-body-md-regular text-text-primary mb-m4 last:mb-0"
              {...props}
            />
          ),
          a: ({ node, ...props }) => (
            <a
              className="text-link-default hover:text-link-hover underline transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul
              className="typography-body-md-regular text-text-primary mb-m4 ml-m6 list-disc space-y-m2"
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              className="typography-body-md-regular text-text-primary mb-m4 ml-m6 list-decimal space-y-m2"
              {...props}
            />
          ),
          li: ({ node, ...props }) => <li className="pl-m2" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="typography-body-md-regular text-text-secondary border-l-4 border-border-strong pl-m6 py-m2 mb-m4 italic"
              {...props}
            />
          ),
          code: ({ node, inline, className, ...props }: any) => {
            if (inline) {
              return (
                <code
                  className="typography-code-sm bg-bg-elevated text-text-primary px-m2 py-m rounded"
                  {...props}
                />
              )
            }
            return <code className="typography-code-sm" {...props} />
          },
          pre: ({ node, ...props }) => (
            <pre
              className="typography-code-sm bg-bg-surface border border-border-default rounded-md p-m4 mb-m4 overflow-x-auto"
              {...props}
            />
          ),
          hr: ({ node, ...props }) => <hr className="border-t border-divider my-m8" {...props} />,
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-text-primary" {...props} />
          ),
          em: ({ node, ...props }) => <em className="italic text-text-primary" {...props} />,
          del: ({ node, ...props }) => (
            <del className="line-through text-text-secondary" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto mb-m4">
              <table className="min-w-full border border-border-default rounded-md" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-bg-surface" {...props} />,
          tbody: ({ node, ...props }) => (
            <tbody className="divide-y divide-border-default" {...props} />
          ),
          tr: ({ node, ...props }) => <tr className="divide-x divide-border-default" {...props} />,
          th: ({ node, ...props }) => (
            <th
              className="typography-label-md text-text-primary px-m4 py-m3 text-left font-medium"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td className="typography-body-md-regular text-text-primary px-m4 py-m3" {...props} />
          ),
          input: ({ node, ...props }) => {
            if (props.type === 'checkbox') {
              return (
                <input type="checkbox" className="mr-m2 accent-brand-primary" disabled {...props} />
              )
            }
            return <input {...props} />
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
