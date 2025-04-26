import { defineConfig } from 'unocss'

export default defineConfig({
  shortcuts: {
    "link": "b-b-dotted b-b-1 b-b-green hover:text-glow hover:b-b-2",
    "divider": "b-green-8 b-dotted b-8 b-b-0 h-0 p-0 my-8 w-1/4 mx-auto",
    "text-glow": "text-shadow-[0_0_0.125rem_white]"
  },
})