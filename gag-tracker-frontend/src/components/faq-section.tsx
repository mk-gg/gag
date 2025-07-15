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
      "No, Grow a Garden Tracker is a fan-made tool created by players, for players. We are not officially affiliated with Grow a Garden.",
  },
  {
    question: "Is it free to use?",
    answer:
      "Yes, this web app is completely free to use!",
  },
  {
    question: "Is the data always 100% accurate?",
    answer:
      "While I do my best to ensure accuracy, the nature of in-game shops and potential server-specific variations means the data may occasionally be slightly outdated or differ from what you see on your specific game server at any given moment especially during updates, when discrepancies can occur.",
  },
  {
    question: "How can I report an issue or suggest a feature?",
    answer:
      "Feedback is appreciated! Please contact me on my discord account (.hyuun) to report bugs, suggest new features, or share your ideas.",
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
