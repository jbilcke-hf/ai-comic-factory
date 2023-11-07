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

export function SettingsDialog() {
  const [isOpen, setOpen] = useState(false)
  const [renderingModelVendor, setRenderingModelVendor] = useLocalStorage<RenderingModelVendor>(
    localStorageKeys.renderingModelVendor,
    defaultSettings.renderingModelVendor
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

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="space-x-1 md:space-x-2">
          <div>
            <span className="hidden md:inline">Settings</span>
          </div>
        </Button> 
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] overflow-y-auto h-[80vh]">
        <DialogHeader>
          <DialogDescription className="w-full text-center text-lg font-bold text-stone-800">
            Custom Settings
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-1 space-y-1 text-stone-800">
          <p className="text-sm text-zinc-700">
            Note: most vendors have a warm-up delay when using a custom or rarely used model. Do not hesitate to try again after 5 minutes if that happens.
          </p>
          <p className="text-sm text-zinc-700">
            Security note: we do not save those settings on our side, instead they are stored inside your web browser, using the local storage.
          </p>
          <Field>
            <Label>Image vendor:</Label>
            <Select
              onValueChange={(value: string) => {
                setRenderingModelVendor(value as RenderingModelVendor)
              }}
              defaultValue={renderingModelVendor}>
              <SelectTrigger className="">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SERVER">Use server settings (default, recommended)</SelectItem>
                <SelectItem value="HUGGINGFACE">Custom Hugging Face model (expert users)</SelectItem>
                <SelectItem value="REPLICATE">Custom Replicate model (expert users)</SelectItem>
                <SelectItem value="OPENAI">DALL·E 3 by OpenAI (partial support, in alpha)</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {renderingModelVendor === "HUGGINGFACE" && <>
            <Field>
              <Label>Hugging Face API Token:</Label>
              <Input
                className="font-mono"
                type="password"
                placeholder="Enter your private api token"
                onChange={(x) => {
                  setHuggingfaceApiKey(x.target.value)
                }}
                value={huggingfaceApiKey}
              />
            </Field>
            <Field>
              <Label>Hugging Face Inference API model:</Label>
              <Input
                className="font-mono"
                placeholder="Name of the Inference API model"
                onChange={(x) => {
                  setHuggingfaceInferenceApiModel(x.target.value)
                }}
                value={huggingfaceInferenceApiModel}
              />
            </Field>
            <p className="text-sm text-zinc-700">
              Using a LoRA? Don&apos;t forget the trigger keyword! Also you will want to use the &quot;Neutral&quot; style.
            </p>
            <Field>
              <Label>LoRA model trigger (optional):</Label>
              <Input
                className="font-mono"
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
              <Label>OpenAI API Token:</Label>
              <Input
                className="font-mono"
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
                className="font-mono"
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
                <Label>Replicate API Token:</Label>
                <Input
                  className="font-mono"
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
                  className="font-mono"
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
                  className="font-mono"
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
                  className="font-mono"
                  placeholder={'LoRA trigger keyword eg. "style of TOK"'}
                  onChange={(x) => {
                    setReplicateApiModelTrigger(x.target.value)
                  }}
                  value={replicateApiModelTrigger}
                />
              </Field>
            </>}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}