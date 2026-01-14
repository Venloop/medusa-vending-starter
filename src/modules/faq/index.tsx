import { Heading } from "@medusajs/ui"
import Accordion from "@modules/common/components/accordion/accordion"

const Faq = ({ title, items }: { title: string, items: { label: string, component: React.ReactNode }[] }) => {
  return (
    <div className="w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
      <div className="content-container py-12 small:py-12 max-w-3.125 mx-auto">
        <Heading level="h1" className="text-ui-fg-base text-2xl leading-tight mb-8 text-center">
          {title}
        </Heading>
        <div className="w-full">
          <Accordion type="multiple">
            {items.map((tab, i) => (
              <Accordion.Item
                key={i}
                title={tab.label}
                headingSize="large"
                value={tab.label}
              >
                {tab.component}
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  )
}

export default Faq
