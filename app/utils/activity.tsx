import { Activity } from '../services/calculator/phase-shift-calculator';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';

export function activityTitle(type: Activity["type"]): string {
  switch (type) {
    case 'sleep': return 'Time for sleep!';
    case 'melatonin': return 'Take melatonin!';
    case 'avoid-food': return 'Avoid eating!';
    case 'avoid-bright-light': return 'Avoid bright light!';
    case 'avoid-darkness': return 'Avoid darkness!';
    case 'avoid-morning-light': return 'Avoid morning light!';
    case 'seek-bright-light': return 'Seek bright light!';
    case 'seek-darkness': return 'Seek darkness!';
    case 'exercise': return 'Sport time!';
    case 'breakfast': return 'Breakfast';
    case 'dinner': return 'Dinner';
    case 'lunch': return 'Lunch';
  }
}

export function activityColor(type: Activity["type"]): string {
  switch (type) {
    case 'sleep': return '#11151c';
    case 'melatonin': return '#a4243b';
    case 'avoid-food': return '#133c55';
    case 'avoid-bright-light': return '#364156';
    case 'avoid-darkness': return '#7d800c';
    case 'avoid-morning-light': return '#455921';
    case 'seek-bright-light': return '#6c7838';
    case 'seek-darkness': return '#212d40';
    case 'exercise': return '#386fa4';
    case 'breakfast': return '#faa613';
    case 'dinner': return '#faa613';
    case 'lunch': return '#faa613';
  }
}

export function activityIcon(type: Activity["type"]): Element {
  const props = {
    size: 32,
    color: 'white',
  };

  switch (type) {
    case 'sleep': return <Ionicons name="md-bed" {...props} />;
    case 'melatonin': return <FontAwesome5 name="pills" {...props} />;
    case 'avoid-food': return <Ionicons name="ios-hand" {...props} />;
    case 'avoid-bright-light': return <Ionicons name="ios-glasses" {...props} />;
    case 'avoid-darkness': return <Ionicons name="md-sunny" {...props} />;
    case 'avoid-morning-light': return <Ionicons name="ios-glasses" {...props} />;
    case 'seek-bright-light': return <Ionicons name="md-sunny" {...props} />;
    case 'seek-darkness': return <Ionicons name="ios-glasses" {...props} />;
    case 'exercise': return <Ionicons name="ios-basketball" {...props} />;
    case 'breakfast': return <Ionicons name="md-pizza" {...props} />;
    case 'dinner': return <Ionicons name="md-pizza" {...props} />;
    case 'lunch': return <Ionicons name="md-pizza" {...props} />;
  }
}
