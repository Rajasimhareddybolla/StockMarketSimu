import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useColorScheme } from 'react-native';
import { ChartBar, ArrowRight, TrendingUp, BarChart4, PiggyBank } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { user, updateUserPreferences } = useAuth();
  const colorScheme = useColorScheme();
  
  const steps = [
    {
      title: "Welcome to StockMarket Simulator",
      description: "Practice trading stocks with virtual money in a risk-free environment.",
      icon: <ChartBar size={48} color={colorScheme === 'dark' ? '#4ADE80' : '#10B981'} />
    },
    {
      title: "Learn Trading",
      description: "Explore market trends, analyze stock performance, and practice investment strategies without real-world risk.",
      icon: <TrendingUp size={48} color={colorScheme === 'dark' ? '#4ADE80' : '#10B981'} />
    },
    {
      title: "Track Performance",
      description: "Monitor your portfolio growth, analyze your trading history, and refine your investment strategy.",
      icon: <BarChart4 size={48} color={colorScheme === 'dark' ? '#4ADE80' : '#10B981'} />
    },
    {
      title: "Build Wealth",
      description: "Start with $10,000 virtual cash and grow your portfolio through smart investment decisions.",
      icon: <PiggyBank size={48} color={colorScheme === 'dark' ? '#4ADE80' : '#10B981'} />
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step complete - mark onboarding as done
      if (user) {
        updateUserPreferences({
          ...user.preferences,
          onboardingComplete: true
        });
      }
      onComplete();
    }
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#F8FAFC' }
    ]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.stepIndicatorContainer}>
          {steps.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.stepDot,
                currentStep === index ? styles.activeDot : {},
                { 
                  backgroundColor: currentStep === index 
                    ? (colorScheme === 'dark' ? '#4ADE80' : '#10B981')
                    : (colorScheme === 'dark' ? '#334155' : '#CBD5E1') 
                }
              ]}
            />
          ))}
        </View>
        
        <View style={styles.contentContainer}>
          <View style={[
            styles.iconContainer,
            { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#E2E8F0' }
          ]}>
            {steps[currentStep].icon}
          </View>
          
          <Text style={[
            styles.title,
            { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
          ]}>
            {steps[currentStep].title}
          </Text>
          
          <Text style={[
            styles.description,
            { color: colorScheme === 'dark' ? '#CBD5E1' : '#475569' }
          ]}>
            {steps[currentStep].description}
          </Text>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
          </Text>
          <ArrowRight size={20} color="#FFFFFF" style={styles.nextButtonIcon} />
        </TouchableOpacity>
        
        {currentStep < steps.length - 1 && (
          <TouchableOpacity 
            style={styles.skipButton} 
            onPress={onComplete}
          >
            <Text style={[
              styles.skipButtonText,
              { color: colorScheme === 'dark' ? '#94A3B8' : '#64748B' }
            ]}>
              Skip
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    width: 20,
  },
  contentContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 16,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  nextButtonIcon: {
    marginLeft: 8,
  },
  skipButton: {
    paddingVertical: 10,
  },
  skipButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});