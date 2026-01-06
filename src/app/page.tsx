
'use client';
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Lock, Pill, QrCode, ClipboardList } from "lucide-react";
import React, { useState, useEffect } from 'react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MediPortLogo } from "@/components/icons";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";

const features = [
  {
    icon: <ClipboardList className="h-8 w-8 text-primary" />,
    title: "Patient Profile Management",
    description: "Securely store and manage your personal details, medical history, and emergency contacts. You control your data's visibility.",
    imageId: "feature-profile",
  },
  {
    icon: <Pill className="h-8 w-8 text-primary" />,
    title: "Medication & Prescription Hub",
    description: "Keep a record of current and past prescriptions, with an AI-powered tool to check for potential medication conflicts.",
    imageId: "feature-meds",
  },
  {
    icon: <QrCode className="h-8 w-8 text-primary" />,
    title: "Emergency QR Access",
    description: "Generate a QR code for emergency responders to access critical info like blood type and allergies, no login required.",
    imageId: "feature-qr",
  },
  {
    icon: <Lock className="h-8 w-8 text-primary" />,
    title: "Role-Based Access Control",
    description: "Grant and revoke access to your data with field-level restrictions for doctors, labs, and pharmacies. Your privacy is paramount.",
    imageId: "feature-history",
  },
];

export default function Home() {
  const [heroImage, setHeroImage] = useState<ImagePlaceholder | undefined>();

  useEffect(() => {
    setHeroImage(PlaceHolderImages.find((img) => img.id === 'hero'));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl font-headline">
            <MediPortLogo className="h-8 w-8 text-primary" />
            MediPort
          </Link>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/login">
                Sign Up <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="relative py-20 sm:py-28 md:py-32 bg-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-foreground font-headline">
              Your Unified Digital Health Identity
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
              MediPort centralizes your medical data securely, giving you and your trusted providers controlled, auditable access anytime, anywhere.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Access Your Portfolio <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary">
                Learn More
              </Button>
            </div>
          </div>
          {heroImage && (
            <div className="absolute inset-0 -z-10 opacity-5">
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                data-ai-hint={heroImage.imageHint}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </section>

        <section className="py-20 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold font-headline">A New Era of Personal Health Management</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Built on a foundation of privacy, consent, and security.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                return (
                  <Card key={feature.title} className="flex flex-col overflow-hidden text-center hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="items-center">
                      <div className="bg-primary/10 p-3 rounded-full">
                        {feature.icon}
                      </div>
                      <CardTitle className="mt-4 font-headline">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
        
        <section className="py-12 bg-card border-t">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-muted-foreground text-sm">
                <p className="font-bold">Academic Prototype Disclaimer</p>
                <p>This platform is a research and academic prototype. It is not a replacement for certified medical systems and should not be used for actual medical diagnosis or treatment.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MediPort. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
