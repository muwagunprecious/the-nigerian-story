"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Send, Sparkles, CheckCircle2, AlertCircle, Lock, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { SectionDecoration, FloatingDecoration } from "@/components/ui/SectionDecoration";

export default function StorySubmission() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    era: "",
    category: "",
    title: "",
    content: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        // Pre-fill from profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", session.user.id)
          .single();

        setFormData(prev => ({
          ...prev,
          name: profile?.username || "",
          email: session.user.email || ""
        }));
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const totalSteps = 4;

  const nextStep = () => {
    // Basic validation for each step
    if (step === 1 && (!formData.name || !formData.email)) {
      setError("Please fill in your name and email.");
      return;
    }
    if (step === 2 && (!formData.location || !formData.era || !formData.category)) {
      setError("Please fill in your location, era, and category.");
      return;
    }
    if (step === 3 && (!formData.title || !formData.content)) {
      setError("Please give your story a title and tell us the story!");
      return;
    }

    setError(null);
    setStep((s) => Math.min(s + 1, totalSteps));
  };

  const prevStep = () => {
    setError(null);
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const submissionData = {
        ...formData,
        user_id: session?.user?.id || null
      };

      const { error: supabaseError } = await supabase
        .from("stories")
        .insert([submissionData]);

      if (supabaseError) throw supabaseError;

      setIsSuccess(true);
    } catch (err: any) {
      console.error("Error submitting story:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    if (isSuccess) {
      return (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 py-12"
        >
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-green-100 border-4 border-green-500 flex items-center justify-center">
              <CheckCircle2 size={48} className="text-green-500" />
            </div>
          </div>
          <h3 className="font-heading font-black text-4xl uppercase">Story Received!</h3>
          <p className="font-body text-xl text-gray-600 max-w-md mx-auto">
            Thank you for sharing your piece of the Nigeria Story. Your contribution has been recorded for the Guinness World Record!
          </p>
          <button
            onClick={() => {
              setIsSuccess(false);
              setStep(1);
              setFormData({
                name: formData.name, // Keep these pre-filled
                email: formData.email,
                location: "",
                era: "",
                category: "",
                title: "",
                content: "",
              });
            }}
            className="btn-primary"
          >
            Submit Another Story
          </button>
        </motion.div>
      );
    }

    if (isAuthenticated === false) {
      return (
        <motion.div
          key="auth-gate"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 space-y-8"
        >
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full bg-brand-yellow/10 border-4 border-dashed border-brand-yellow flex items-center justify-center relative">
              <Lock size={64} className="text-brand-yellow" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-brand-black rounded-full flex items-center justify-center shadow-lg"
              >
                <Sparkles size={16} className="text-brand-yellow" />
              </motion.div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-heading font-black text-4xl uppercase text-brand-black">Your Voice Matters!</h3>
            <p className="font-body text-gray-600 text-xl max-w-sm mx-auto">
              To contribute to the Guinness World Record, we need to verify your entry. Please login or create an account.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/login" className="btn-secondary text-xl px-12 py-4 flex items-center justify-center gap-2">
              Login <ArrowRight size={20} />
            </Link>
            <Link href="/signup" className="btn-primary text-xl px-12 py-4 flex items-center justify-center gap-2">
              Join the Record <UserPlus size={24} />
            </Link>
          </div>
        </motion.div>
      );
    }

    if (isAuthenticated === null) {
      return (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-yellow"></div>
        </div>
      );
    }

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
              <label className="font-heading font-bold text-lg text-white">First, what's your name?</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="E.g., Oluwafemi Johnson"
                className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl focus:outline-none focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/20 transition-all font-body text-xl text-white shadow-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="font-heading font-bold text-lg text-white">And your email address?</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl focus:outline-none focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/20 transition-all font-body text-xl text-white shadow-xl"
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
              <label className="font-heading font-bold text-lg text-white">Where in Nigeria are you from?</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="E.g., Lagos, Kano, Port Harcourt..."
                className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl focus:outline-none focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/20 transition-all font-body text-xl text-white shadow-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="font-heading font-bold text-lg text-white">Which year or era does your story belong to?</label>
              <input
                type="text"
                name="era"
                value={formData.era}
                onChange={handleInputChange}
                placeholder="E.g., 1960s, 1999, Present day"
                className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl focus:outline-none focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/20 transition-all font-body text-xl text-white shadow-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="font-heading font-bold text-lg text-white">Pick a category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl focus:outline-none focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/20 transition-all font-body text-xl text-white appearance-none shadow-xl"
              >
                <option value="" disabled>Select an option...</option>
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
              <label className="font-heading font-bold text-lg text-white">Give your story a title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Make it catchy!"
                className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl focus:outline-none focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/20 transition-all font-body text-xl text-white shadow-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="font-heading font-bold text-lg text-white">The Story itself</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={6}
                placeholder="Tell us what happened... (Nigeria is listening!)"
                className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl focus:outline-none focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/20 transition-all font-body text-xl text-white resize-none shadow-xl"
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
              Hit submit to join the record! You're making history.
            </p>
            <div className="p-8 border-4 border-dashed border-brand-black rounded-3xl bg-gray-50 text-center shadow-[4px_4px_0px_0px_#000]">
              <div className="space-y-4">
                <div className="text-left bg-white p-4 rounded-xl border-2 border-brand-black">
                  <p className="font-bold text-brand-black">{formData.title || "Untilted Story"}</p>
                  <p className="text-sm text-gray-500 italic">by {formData.name || "Anonymous"}</p>
                </div>
                <p className="text-gray-500 font-heading font-bold">Ready to record this memory?</p>
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="submit" className="w-full py-24 bg-black">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto px-6"
      >
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-brand-yellow text-black font-heading font-bold rounded-full mb-4 transform -rotate-2">
            {isSuccess ? "Success!" : !isAuthenticated ? "Join the Record" : `Step ${step} of ${totalSteps}`}
          </div>
          <h2 className="font-hero text-5xl md:text-7xl mb-4 text-brand-yellow uppercase">
            ADD YOUR <span className="text-white">STORY</span>
          </h2>
          {/* Progress bar */}
          {!isSuccess && isAuthenticated && (
            <div className="w-48 h-2 bg-white/10 rounded-full mx-auto mt-6 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(step / totalSteps) * 100}%` }}
                className="h-full bg-brand-yellow"
              />
            </div>
          )}
        </div>

        <div className="bg-white/5 backdrop-blur-xl p-8 md:p-16 border border-white/10 rounded-[3rem] relative min-h-[500px] flex flex-col justify-between shadow-2xl">
          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-4 left-8 right-8 bg-red-100 border-2 border-red-500 text-red-700 px-4 py-2 rounded-xl flex items-center gap-2 z-10"
              >
                <AlertCircle size={20} />
                <span className="font-bold">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Content */}
          <div className="flex-grow">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          {!isSuccess && isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t-2 border-dashed border-gray-200">
              {step > 1 && (
                <button
                  onClick={prevStep}
                  disabled={isSubmitting}
                  className="btn-secondary w-full sm:w-auto text-xl flex items-center justify-center gap-2 disabled:opacity-50"
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
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-brand-yellow text-black px-12 py-4 rounded-full font-heading font-black text-2xl hover:scale-105 transition-all shadow-[6px_6px_0px_0px_#FFFFFF] uppercase ml-auto disabled:opacity-50"
                  style={{ backgroundColor: '#FFA500' }}
                >
                  {isSubmitting ? "Submitting..." : "Submit Story"} <Send size={28} className="ml-2" />
                </button>
              )}
            </div>
          )}

          {/* Decorative Doodles */}
          <div className="absolute -bottom-10 -left-10 w-48 opacity-10 hidden md:block rotate-12 group-hover:rotate-0 transition-transform duration-700">
            <SectionDecoration src="/images/dashboard/drum.png" className="w-full" />
          </div>
          
          <div className="absolute -top-12 -right-12 w-48 opacity-10 hidden md:block -rotate-12 group-hover:rotate-0 transition-transform duration-700">
            <SectionDecoration src="/images/dashboard/hat.png" className="w-full" />
          </div>

          <FloatingDecoration 
            src="/images/dashboard/cowries.png" 
            className="top-1/4 left-5 w-16 opacity-20" 
            delay={1} 
          />
          <FloatingDecoration 
            src="/images/dashboard/nok.png" 
            className="bottom-1/4 right-5 w-24 opacity-10" 
            delay={2} 
          />
          <FloatingDecoration 
            src="/images/dashboard/palm.png" 
            className="top-10 left-[20%] w-32 opacity-10 translate-x-[-50%]" 
            delay={3} 
          />
        </div>
      </motion.div>
    </section>
  );
}

