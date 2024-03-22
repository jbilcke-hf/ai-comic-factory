"use client"

import { useState } from "react"
import { useLocalStorage } from 'usehooks-ts'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { RenderingModelVendor } from "@/types"
import { Input } from "@/components/ui/input"

import { Label } from "./label"
import { Field } from "./field"
import { localStorageKeys } from "./localStorageKeys"
import { defaultSettings } from "./defaultSettings"

import { useDynamicConfig } from "@/lib/useDynamicConfig"
import { Slider } from "@/components/ui/slider"
import { fonts } from "@/lib/fonts"

export function SettingsDialog() {
  const [isOpen, setOpen] = useState(false)
  const [renderingModelVendor, setRenderingModelVendor] = useLocalStorage<RenderingModelVendor>(
    localStorageKeys.renderingModelVendor,
    defaultSettings.renderingModelVendor
  )
  const [renderingUseTurbo, setRenderingUseTurbo] = useLocalStorage<boolean>(
    localStorageKeys.renderingUseTurbo,
    defaultSettings.renderingUseTurbo
  )
  const [huggingfaceApiKey, setHuggingfaceApiKey] = useLocalStorage<string>(
    localStorageKeys.huggingfaceApiKey,
    defaultSettings.huggingfaceApiKey
  )
  const [huggingfaceInferenceApiModel, setHuggingfaceInferenceApiModel] = useLocalStorage<string>(
    localStorageKeys.huggingfaceInferenceApiModel,
    defaultSettings.huggingfaceInferenceApiModel
  )
  const [huggingfaceInferenceApiModelTrigger, setHuggingfaceInferenceApiModelTrigger] = useLocalStorage<string>(
    localStorageKeys.huggingfaceInferenceApiModelTrigger,
    defaultSettings.huggingfaceInferenceApiModelTrigger
  )
  const [huggingfaceInferenceApiFileType, setHuggingfaceInferenceApiFileType] = useLocalStorage<string>(
    localStorageKeys.huggingfaceInferenceApiFileType,
    defaultSettings.huggingfaceInferenceApiFileType
  )
  const [replicateApiKey, setReplicateApiKey] = useLocalStorage<string>(
    localStorageKeys.replicateApiKey,
    defaultSettings.replicateApiKey
  )
  const [replicateApiModel, setReplicateApiModel] = useLocalStorage<string>(
    localStorageKeys.replicateApiModel,
    defaultSettings.replicateApiModel
  )
  const [replicateApiModelVersion, setReplicateApiModelVersion] = useLocalStorage<string>(
    localStorageKeys.replicateApiModelVersion,
    defaultSettings.replicateApiModelVersion
  )
  const [replicateApiModelTrigger, setReplicateApiModelTrigger] = useLocalStorage<string>(
    localStorageKeys.replicateApiModelTrigger,
    defaultSettings.replicateApiModelTrigger
  )
  const [openaiApiKey, setOpenaiApiKey] = useLocalStorage<string>(
    localStorageKeys.openaiApiKey,
    defaultSettings.openaiApiKey
  )
  const [openaiApiModel, setOpenaiApiModel] = useLocalStorage<string>(
    localStorageKeys.openaiApiModel,
    defaultSettings.openaiApiModel
  )
  const [userDefinedMaxNumberOfPages, setUserDefinedMaxNumberOfPages] = useLocalStorage<number>(
    localStorageKeys.userDefinedMaxNumberOfPages,
    defaultSettings.userDefinedMaxNumberOfPages
  )

  const { config: { maxNbPages }, isConfigReady } = useDynamicConfig()

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="space-x-1 md:space-x-2">
          <div>
            <span className="hidden md:inline">Custom models</span>
          </div>
        </Button> 
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-[500px] md:max-w-[700px] overflow-y-auto h-max-[100vh] md:h-max-[80vh]">
        <DialogHeader>
          <DialogDescription className="w-full text-center text-lg font-bold text-stone-800">
            Custom Models
          </DialogDescription>
        </DialogHeader>
        {
        // isConfigReady && <Field>
        // <Label>Maximum number of pages: {userDefinedMaxNumberOfPages}</Label>
        // <Slider
        //   min={1}
        //   max={maxNbPages}
        //   step={1}
        //   onValueChange={(value: any) => {
        //     let numericValue = Number(value[0])
        //     numericValue = !isNaN(value[0]) && isFinite(value[0]) ? numericValue : 0
        //     numericValue = Math.min(maxNbPages, Math.max(1, numericValue))
        //     setUserDefinedMaxNumberOfPages(numericValue)
        //   }}
        //   defaultValue={[userDefinedMaxNumberOfPages]}
        //   value={[userDefinedMaxNumberOfPages]}
        // />
        // </Field>
        }
        <div className="grid gap-4 py-1 space-y-1 text-stone-800">
          <Field>
            <Label>Image rendering provider:</Label>
            <p className="pt-2 pb-3 text-base italic text-zinc-600">
            ℹ️ Some API vendors have a delay for rarely used models.<br/>
            👉 In case of trouble, try again after 5-10 minutes.
            </p>

            <Select
              onValueChange={(value: string) => {
                setRenderingModelVendor(value as RenderingModelVendor)
              }}
              defaultValue={renderingModelVendor}>
              <SelectTrigger className="">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SERVER">Use server settings (default)</SelectItem>
                <SelectItem value="HUGGINGFACE">Custom Hugging Face model (recommended)</SelectItem>
                <SelectItem value="REPLICATE">Custom Replicate model (will use your own account)</SelectItem>
                <SelectItem value="OPENAI">DALL·E 3 by OpenAI (partial support, will use your own account)</SelectItem>
              </SelectContent>
            </Select>
          </Field>
            
          
          {
          // renderingModelVendor === "SERVER" && <>
          //   <Field>
          //     <Label>Quality over performance ratio (beta, deprecated):</Label>
          //     <div className="flex flex-row space-x-2 text-zinc-500">
          //       <Switch
          //         // checked={renderingUseTurbo}
          //         // onCheckedChange={setRenderingUseTurbo}
          //         checked={false}
          //         disabled
          //         className="opacity-30 pointer-events-none"
          //       />
          //       {/*
          //       <span
          //         onClick={() => setRenderingUseTurbo(!renderingUseTurbo)}
          //         className={cn("cursor-pointer", { "text-zinc-800": renderingUseTurbo })}>
          //           Use a faster, but lower quality model (you are warned!)
          //         </span>
          //     */}
          //     <span className="text-zinc-500 italic">
          //       Following feedbacks from users (low rendering quality on comics) the fast renderer has been disabled.
          //     </span>
          //     </div>
          //   </Field>
          // </>
          }

          {renderingModelVendor === "HUGGINGFACE" && <>
            <Field>
              <Label>Hugging Face API Token (<a className="text-stone-600 underline" href="https://huggingface.co/subscribe/pro" target="_blank">PRO account</a> recommended for higher rate limit):</Label>
              <Input
                className={fonts.actionman.className}
                type="password"
                placeholder="Enter your private api token"
                onChange={(x) => {
                  setHuggingfaceApiKey(x.target.value)
                }}
                value={huggingfaceApiKey}
              />
            </Field>
            <Field>
              <Label>Inference API model (custom SDXL or SDXL LoRA):</Label>
              <Input
                className={fonts.actionman.className}
                placeholder="Name of the Inference API model"
                onChange={(x) => {
                  setHuggingfaceInferenceApiModel(x.target.value)
                }}
                value={huggingfaceInferenceApiModel}
              />
            </Field>
            <Field>
              <Label>The file type supported by the model (jpg, webp..):</Label>
              <Input
                className={fonts.actionman.className}
                placeholder="Inference API file type"
                onChange={(x) => {
                  setHuggingfaceInferenceApiFileType(x.target.value)
                }}
                value={huggingfaceInferenceApiFileType}
              />
            </Field>
            <p className="text-sm text-zinc-700">
              Using a LoRA? Don&apos;t forget the trigger keyword! Also you will want to use the &quot;Neutral&quot; style.
            </p>
            <Field>
              <Label>LoRA model trigger (optional):</Label>
              <Input
                className={fonts.actionman.className}
                placeholder="Trigger keyword (if you use a LoRA)"
                onChange={(x) => {
                  setHuggingfaceInferenceApiModelTrigger(x.target.value)
                }}
                value={huggingfaceInferenceApiModelTrigger}
              />
              </Field>
          </>}

          {renderingModelVendor === "OPENAI" && <>
            <Field>
              <Label>OpenAI API Token (you will be billed based on OpenAI pricing):</Label>
              <Input
                className={fonts.actionman.className}
                type="password"
                placeholder="Enter your private api token"
                onChange={(x) => {
                  setOpenaiApiKey(x.target.value)
                }}
                value={openaiApiKey}
              />
            </Field>
            <Field>
              <Label>OpenAI image model:</Label>
              <Input
                className={fonts.actionman.className}
                placeholder="OpenAI image model"
                onChange={(x) => {
                  setOpenaiApiModel(x.target.value)
                }}
                value={openaiApiModel}
              />
            </Field>
          </>}

          {renderingModelVendor === "REPLICATE" && <>
              <Field>
                <Label>Replicate API Token (you will be billed based on Replicate pricing):</Label>
                <Input
                  className={fonts.actionman.className}
                  type="password"
                  placeholder="Enter your private api token"
                  onChange={(x) => {
                    setReplicateApiKey(x.target.value)
                  }}
                  value={replicateApiKey}
                />
              </Field>
              <Field>
                <Label>Replicate model name:</Label>
                <Input
                  className={fonts.actionman.className}
                  placeholder="Name of the Replicate model"
                  onChange={(x) => {
                    setReplicateApiModel(x.target.value)
                  }}
                  value={replicateApiModel}
                />
              </Field>
              <Field>
                <Label>Model version:</Label>
                <Input
                  className={fonts.actionman.className}
                  placeholder="Version of the Replicate model"
                  onChange={(x) => {
                    setReplicateApiModelVersion(x.target.value)
                  }}
                  value={replicateApiModelVersion}
                />
              </Field>
              <p className="text-sm text-zinc-700">
                Using a LoRA? Don&apos;t forget the trigger keyword! Also you will want to use the &quot;Neutral&quot; style.
              </p>
              <Field>
                <Label>LoRA model trigger (optional):</Label>
                <Input
                  className={fonts.actionman.className}
                  placeholder={'Eg. "In the style of TOK" etc'}
                  onChange={(x) => {
                    setReplicateApiModelTrigger(x.target.value)
                  }}
                  value={replicateApiModelTrigger}
                />
              </Field>
            </>}

            <p className="text-sm text-zinc-700 italic">
            🔒 Settings such as API keys are stored inside your browser and aren&apos;t kept on our servers.
            </p>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}