import { useState, useEffect } from "react"

import questions from './assets/data/questions.json';


import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

import { Progress } from "@/components/ui/progress"

import { Separator } from "@/components/ui/separator"

import { Label } from "@/components/ui/label"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

function App() {

  const [results, setResults] = useState([0, 0, 0, 0, 0, 0])
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
 
  useEffect(() => {
    if (!api) {
      return
    }
 
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
 
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])


  return (
    <div className="flex flex-col items-center justify-center">
      <Progress
        className="w-full max-w-md h-2 mb-3 "
        value={current / count * 100}
      />

      <Carousel setApi={setApi} className="w-full max-w-md">
        <CarouselContent>
          {questions.map((_, index) => (
            <CarouselItem className="" key={index}>
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <span className="text-xl font-semibold">{_.q}</span>
                  <Separator className="my-4" />
                  <RadioGroup>
                    {_.a.map((_, index) => (
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem key={index} value={_} id={`a${index}`} />
                        <Label htmlFor={`a${index}`}>{_}</Label></div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
export default App
