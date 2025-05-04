import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Path, Line, Circle, Text as SvgText } from 'react-native-svg';
import { ChartData } from '@/types/stocks';
import { formatCurrency } from '@/utils/stockUtils';
import { useColorScheme } from 'react-native';

interface StockChartProps {
  data: ChartData[];
  basePrice: number;
}

const CHART_HEIGHT = 200;
const CHART_WIDTH = Dimensions.get('window').width - 40; // Full width minus padding
const CIRCLE_RADIUS = 4;

type TimeRange = '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';

export default function StockChart({ data, basePrice }: StockChartProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('1M');
  const [selectedPoint, setSelectedPoint] = useState<ChartData | null>(null);
  const colorScheme = useColorScheme();
  
  // Filter data based on selected range
  const filteredData = (() => {
    const today = new Date();
    
    switch (selectedRange) {
      case '1D':
        return data.slice(-2);
      case '1W':
        return data.slice(-7);
      case '1M':
        return data; // Use all data since we're showing 30 days by default
      case '3M':
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(today.getMonth() - 3);
        return data.filter(d => new Date(d.date) >= threeMonthsAgo);
      case '1Y':
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        return data.filter(d => new Date(d.date) >= oneYearAgo);
      case 'ALL':
        return data;
      default:
        return data;
    }
  })();
  
  if (filteredData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No data available</Text>
      </View>
    );
  }
  
  // Get min and max values for scaling
  const values = filteredData.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue;
  
  // Add padding to value range
  const paddedMin = Math.max(0, minValue - (valueRange * 0.1));
  const paddedMax = maxValue + (valueRange * 0.1);
  const paddedRange = paddedMax - paddedMin;
  
  // Scale value to fit chart height
  const scaleY = (value: number) => {
    return CHART_HEIGHT - ((value - paddedMin) / paddedRange) * CHART_HEIGHT;
  };
  
  // Scale X based on data index
  const scaleX = (index: number) => {
    return (index / (filteredData.length - 1)) * CHART_WIDTH;
  };
  
  // Generate path
  let pathD = '';
  filteredData.forEach((point, index) => {
    const x = scaleX(index);
    const y = scaleY(point.value);
    
    if (index === 0) {
      pathD += `M ${x} ${y}`;
    } else {
      pathD += ` L ${x} ${y}`;
    }
  });
  
  // Determine if chart is positive or negative
  const firstValue = filteredData[0].value;
  const lastValue = filteredData[filteredData.length - 1].value;
  const isPositive = lastValue >= firstValue;
  
  // Chart line color based on trend
  const chartColor = isPositive ? '#10B981' : '#EF4444';
  
  // Calculate percentage change
  const percentChange = ((lastValue - firstValue) / firstValue) * 100;
  
  const handlePointSelect = (point: ChartData) => {
    setSelectedPoint(point);
  };
  
  const displayPrice = selectedPoint?.value || lastValue;
  
  return (
    <View style={styles.container}>
      <View style={styles.priceContainer}>
        <Text style={[
          styles.priceText, 
          { color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A' }
        ]}>
          {formatCurrency(displayPrice)}
        </Text>
        <View style={styles.changeContainer}>
          <Text style={[
            styles.changeText,
            isPositive ? styles.positive : styles.negative
          ]}>
            {isPositive ? '+' : ''}{percentChange.toFixed(2)}%
          </Text>
        </View>
      </View>
      
      <View style={styles.chartContainer}>
        <Svg height={CHART_HEIGHT} width={CHART_WIDTH}>
          {/* Horizontal grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map(factor => {
            const y = CHART_HEIGHT * factor;
            return (
              <Line
                key={`grid-${factor}`}
                x1={0}
                y1={y}
                x2={CHART_WIDTH}
                y2={y}
                stroke={colorScheme === 'dark' ? '#334155' : '#E2E8F0'}
                strokeWidth={1}
              />
            );
          })}
          
          {/* Chart path */}
          <Path
            d={pathD}
            fill="none"
            stroke={chartColor}
            strokeWidth={2}
          />
          
          {/* Interactive data points */}
          {filteredData.map((point, index) => {
            const x = scaleX(index);
            const y = scaleY(point.value);
            
            const isSelected = selectedPoint?.date === point.date;
            
            return (
              <Circle
                key={`point-${index}`}
                cx={x}
                cy={y}
                r={isSelected ? CIRCLE_RADIUS : 0}
                fill={isSelected ? chartColor : 'transparent'}
                onPress={() => handlePointSelect(point)}
              />
            );
          })}
          
          {/* Chart labels */}
          <SvgText
            x={5}
            y={15}
            fontSize={12}
            fill={colorScheme === 'dark' ? '#94A3B8' : '#64748B'}
          >
            {formatCurrency(paddedMax)}
          </SvgText>
          
          <SvgText
            x={5}
            y={CHART_HEIGHT - 5}
            fontSize={12}
            fill={colorScheme === 'dark' ? '#94A3B8' : '#64748B'}
          >
            {formatCurrency(paddedMin)}
          </SvgText>
        </Svg>
      </View>
      
      <View style={styles.timeRangeContainer}>
        {(['1D', '1W', '1M', '3M', '1Y', 'ALL'] as TimeRange[]).map(range => (
          <TouchableOpacity
            key={range}
            style={[
              styles.rangeButton,
              selectedRange === range && [
                styles.selectedRange,
                { backgroundColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0' }
              ]
            ]}
            onPress={() => setSelectedRange(range)}
          >
            <Text style={[
              styles.rangeText,
              selectedRange === range && styles.selectedRangeText,
              { color: selectedRange === range 
                ? (colorScheme === 'dark' ? '#F8FAFC' : '#0F172A') 
                : (colorScheme === 'dark' ? '#94A3B8' : '#64748B') }
            ]}>
              {range}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  priceText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginRight: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  positive: {
    color: '#10B981',
  },
  negative: {
    color: '#EF4444',
  },
  chartContainer: {
    height: CHART_HEIGHT,
    marginBottom: 16,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  selectedRange: {
    borderRadius: 16,
  },
  rangeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  selectedRangeText: {
    fontFamily: 'Inter-SemiBold',
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#64748B',
  },
});