'use client';

import { useState, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: Array<{
    description: string;
  }>;
}

export default function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric&lang=zh_cn`
      );
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || '获取天气信息失败');
      }
      
      setWeather(data);
      setError('');
    } catch (err: any) {
      setError(err.message);
      setWeather(null);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 p-4">
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">天气查询</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                value={city}
                onChange={handleInputChange}
                placeholder="输入城市名称"
                className="flex-1"
              />
              <Button onClick={fetchWeather}>
                查询
              </Button>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
            
            {weather && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-center">{weather.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-lg">温度: {Math.round(weather.main.temp)}°C</p>
                  <p className="text-lg">湿度: {weather.main.humidity}%</p>
                  <p className="text-lg">风速: {weather.wind.speed} m/s</p>
                  <p className="text-lg">天气: {weather.weather[0].description}</p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
