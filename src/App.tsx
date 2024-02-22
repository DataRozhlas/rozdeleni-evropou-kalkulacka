import { useState, useEffect } from "react"

import questions from "./assets/data/questions.json";
import charts from "./assets/data/minicharts.json";

import img1 from "./assets/img/1.png";
import img2 from "./assets/img/2.png";
import img3 from "./assets/img/3.png";
import img4 from "./assets/img/4.png";
import img5 from "./assets/img/5.png";
import img6 from "./assets/img/6.png";


const images = [img1, img2, img3, img4, img5, img6]

import Highcharts from 'highcharts';
import {
  HighchartsProvider,
} from "react-jsx-highcharts";

import MiniChart from './components/MiniChart';


import { Button } from "@/components/ui/button"

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

import { usePostMessageWithHeight } from './hooks/usePostHeightMessage'


const groups = ["euronadšence", "příznivce EU", "vlažné příznivce EU", "nejisté", "odpůrce EU", "skalní odpůrce EU"]

const calculateResult = function (result: number[]) {
  const prumEU = (result[0] + result[1] + result[2] + result[4]) / 4;
  // Recode prumEU into SEG
  let SEG;
  let SEGeu: number = 0;

  if (prumEU <= 1.8) SEG = 1;
  else if (prumEU <= 2.3) SEG = 2;
  else if (prumEU <= 2.8) SEG = 3;
  else SEG = 4;

  // Define SEGeu and set its value based on SEG and other conditions
  if (SEG === 1 && result[3] === 1) SEGeu = 1;
  else if (SEG === 1 && result[3] !== 1) SEGeu = 2;
  else if (SEG === 2) SEGeu = 3;
  else if (SEG === 3) SEGeu = 4;
  else if (SEG === 4 && result[5] !== 5) SEGeu = 5;
  else if (SEG === 4 && result[5] === 5) SEGeu = 6;

  return SEGeu;
}

function App() {

  const [results, setResults] = useState([0, 0, 0, 0, 0, 0])
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(0)

  const { containerRef, postHeightMessage } = usePostMessageWithHeight(`rozdeleni-evropou-kalkulacka`);

  useEffect(() => {
    postHeightMessage();
    setSelectedAnswer(results[current - 1])
  }, [current, selectedAnswer]);

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
    <div className="flex flex-col items-center justify-center" ref={containerRef}>
      <Progress
        className="w-full max-w-[620px] h-2 mb-2 "
        value={current / count * 100}
      />

      <Carousel setApi={setApi} className="w-full max-w-[620px]">
        <CarouselContent >
          {questions.map((question, index) => (
            <CarouselItem className="" key={index}>
              <Card>
                <CardContent className="flex flex-col aspect-[4/3] items-center justify-start p-6">
                  <span className="text-xl font-semibold">{question.q}</span>
                  <Separator className="my-4" />
                  <RadioGroup onValueChange={(e) => { setSelectedAnswer(question.a.indexOf(e) + 1); setResults(oldResults => { const newResults = oldResults; newResults[index] = question.a.indexOf(e) + 1; return newResults }) }}
                  >
                    {question.a.map((answer, ind) => (
                      <div className="flex items-center space-x-2" key={ind} >
                        <RadioGroupItem value={answer} id={`${index}-${ind}`}
                        />
                        <Label htmlFor={`${index}-${ind}`}>{answer}</Label></div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}          <CarouselItem>
            <Card>
              {results.some(item => item == 0) && <CardContent className="flex flex-col aspect-[4/3] items-center justify-center p-6">
                <span className="text-xl font-semibold">Až odpovíte na všechny otázky, uvidíte zde výsledek. Ještě jste neodpověděli:</span>
                <Separator className="my-4" />
                {questions.map((_, index) => results[index] == 0 && <li key={crypto.randomUUID()}><Button className="h-0 py-0" variant="link" onClick={() => api?.scrollTo(index)}><div className="max-w-xs truncate">{_.q}</div></Button></li>)}
              </CardContent>}
              {results.every(item => item > 0) && <CardContent className="flex flex-col aspect-[4/3] items-center justify-center p-6">
                <span className="text-xl font-semibold">Patříte mezi {groups[calculateResult(results) - 1]}</span>
                <img className="max-w-[550px]" src={images[calculateResult(results) - 1]}></img>
              </CardContent>}
            </Card>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      {selectedAnswer > 0 && current < count && <div className="w-full px-1 max-w-[620px]">
        <div className="text-md font-bold py-8 text-center">Kdo odpovídal stejně jako vy?</div>
        <div className="grid grid-cols-2 gap-2 ">
          <HighchartsProvider Highcharts={Highcharts}>
            {charts.map((_, index) => <MiniChart key={crypto.randomUUID()} title={_.title} categories={_.categories} start={_.start} end={_.end} selectedAnswer={selectedAnswer} current={current} index={index}/>)}
          </HighchartsProvider>
        </div>
      </div>}
    </div>
  )
}
export default App
