"use client"

import { motion } from "framer-motion"
import { Badge } from "../components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion"

const faqData = [
  {
    question: "What is Grow a Garden Tracker?",
    answer:
      "This is a fan-made website designed to help players easily track the current stock available in the in-game shops. It aims to provide real-time or near real-time data to help you track what is the current available stock.",
  },
  {
    question: "Is this website affiliated with the official Grow a Garden game?",
    answer:
      "No, Grow a Garden Tracker is a fan-made tool created by players, for players. We are not officially affiliated with Grow a Garden nor the Garden Game developers,",
  },
  {
    question: "Is there a limit to how many users I can add?",
    answer:
      "The number of users depends on your plan. The Starter plan allows up to 5 team members, the Professional plan allows up to 20, and the Enterprise plan has no limit on team members.",
  },
  {
    question: "Do you offer discounts for nonprofits or educational institutions?",
    answer:
      "Yes, we offer special pricing for nonprofits, educational institutions, and open-source projects. Please contact our sales team for more information.",
  },
  {
    question: "How secure is my data?",
    answer:
      "We take security very seriously. All data is encrypted both in transit and at rest. We use industry-standard security practices and regularly undergo security audits. Our platform is compliant with GDPR, CCPA, and other relevant regulations.",
  },
  {
    question: "Is it free to use?",
    answer:
      "Yes, this tracker is completely free to use!",
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="w-full py-20 md:py-32">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
            FAQ
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <p className="max-w-[800px] text-muted-foreground md:text-lg">
            Find answers to common questions about our platform.
          </p>
        </motion.div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <AccordionItem value={`item-${i}`} className="border-b border-border/40 py-2">
                  <AccordionTrigger className="text-left font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
