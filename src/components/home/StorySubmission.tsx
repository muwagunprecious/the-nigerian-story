"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Send, Sparkles } from "lucide-react";

export default function StorySubmission() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="font-heading font-bold text-lg text-brand-black">First, what's your name?</label>
              <input
                type="text"
                placeholder="E.g., Oluwafemi Johnson"
                className="w-full px-6 py-4 bg-gray-50 border-2 border-brand-black rounded-2xl focus:outline-none focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/20 transition-all font-body text-xl text-brand-black shadow-[4px_4px_0px_0px_#000]"
              />
            </div>
            <div className="space-y-2">
              <label className="font-heading font-bold text-lg text-brand-black">And your email address?</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-6 py-4 bg-gray-50 border-2 border-brand-black rounded-2xl focus:outline-none focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/20 transition-all font-body text-xl text-brand-black shadow-[4px_4px_0px_0px_#000]"
              />
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="font-heading font-bold text-lg text-brand-black">Where in Nigeria are you from?</label>
              <input
                type="text"
                placeholder="E.g., Lagos, Kano, Port Harcourt..."
                className="w-full px-6 py-4 bg-gray-50 border-2 border-brand-black rounded-2xl focus:outline-none focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/20 transition-all font-body text-xl text-brand-black shadow-[4px_4px_0px_0px_#000]"
              />
            </div>
            <div className="space-y-2">
              <label className="font-heading font-bold text-lg text-brand-black">Which year or era does your story belong to?</label>
              <input
                type="text"
                placeholder="E.g., 1960s, 1999, Present day"
                className="w-full px-6 py-4 bg-gray-50 border-2 border-brand-black rounded-2xl focus:outline-none focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/20 transition-all font-body text-xl text-brand-black shadow-[4px_4px_0px_0px_#000]"
              />
            </div>
            <div className="space-y-2">
              <label className="font-heading font-bold text-lg text-brand-black">Pick a category</label>
              <select className="w-full px-6 py-4 bg-gray-50 border-2 border-brand-black rounded-2xl focus:outline-none focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/20 transition-all font-body text-xl text-brand-black appearance-none shadow-[4px_4px_0px_0px_#000]">
                <option value="none" disabled selected>Select an option...</option>
                <option value="before-independence">Before Independence</option>
                <option value="after-independence">After Independence</option>
                <option value="cultural">Cultural Story</option>
                <option value="personal">Personal Nigerian Experience</option>
              </select>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="font-heading font-bold text-lg text-brand-black">Give your story a title</label>
              <input
                type="text"
                placeholder="Make it catchy!"
                className="w-full px-6 py-4 bg-gray-50 border-2 border-brand-black rounded-2xl focus:outline-none focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/20 transition-all font-body text-xl text-brand-black shadow-[4px_4px_0px_0px_#000]"
              />
            </div>
            <div className="space-y-2">
              <label className="font-heading font-bold text-lg text-brand-black">The Story itself</label>
              <textarea
                rows={6}
                placeholder="Tell us what happened... (Nigeria is listening!)"
                className="w-full px-6 py-4 bg-gray-50 border-2 border-brand-black rounded-2xl focus:outline-none focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/20 transition-all font-body text-xl text-brand-black resize-none shadow-[4px_4px_0px_0px_#000]"
              ></textarea>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-brand-yellow border-4 border-brand-black flex items-center justify-center animate-bounce">
                <Sparkles size={48} className="text-brand-black" />
              </div>
            </div>
            <h3 className="font-heading font-black text-3xl mb-4 uppercase">Almost There!</h3>
            <p className="font-body text-gray-600 mb-8 text-lg">
              You can optionally upload a photo to accompany your story. Once done, hit submit to join the record!
            </p>
            <div className="w-full px-4 py-12 border-4 border-dashed border-brand-black rounded-3xl bg-gray-50 text-center cursor-pointer hover:bg-yellow-50 transition-colors shadow-[4px_4px_0px_0px_#000]">
              <p className="text-gray-500 font-heading font-bold text-xl">📸 Click to upload a photo</p>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="submit" className="w-full py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-brand-black text-brand-white font-heading font-bold rounded-full mb-4 transform -rotate-2">
            Step {step} of {totalSteps}
          </div>
          <h2 className="font-heading font-black text-5xl md:text-7xl mb-4">
            ADD YOUR <span className="text-brand-yellow italic">STORY</span>
          </h2>
          {/* Progress bar */}
          <div className="w-48 h-3 bg-gray-200 rounded-full mx-auto mt-4 border-2 border-brand-black overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              className="h-full bg-brand-yellow"
            />
          </div>
        </div>

        <div className="bg-brand-white p-8 md:p-16 shadow-card hover:shadow-card-hover relative min-h-[500px] flex flex-col justify-between">
          {/* Form Content */}
          <div className="flex-grow">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t-2 border-dashed border-gray-200">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="btn-secondary w-full sm:w-auto text-xl flex items-center justify-center gap-2"
              >
                <ArrowLeft size={24} /> Back
              </button>
            )}

            {step < totalSteps ? (
              <button
                onClick={nextStep}
                className="btn-primary w-full sm:flex-1 text-2xl flex items-center justify-center gap-2 ml-auto"
              >
                Next <ArrowRight size={28} />
              </button>
            ) : (
              <button
                type="button"
                className="btn-primary w-full sm:flex-1 text-2xl flex items-center justify-center gap-2 ml-auto"
                style={{ backgroundColor: '#F5B301' }}
              >
                Submit Story <Send size={28} className="ml-2" />
              </button>
            )}
          </div>

          {/* Decorative Doodle */}
          <div className="absolute -bottom-8 -left-8 text-brand-yellow hidden md:block rotate-12">
            <svg width="80" height="80" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 0L38.4526 21.5474L60 30L38.4526 38.4526L30 60L21.5474 38.4526L0 30L21.5474 21.5474L30 0Z" fill="currentColor" stroke="#000" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

