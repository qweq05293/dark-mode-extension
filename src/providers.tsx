import { Toaster } from "./components/ui/sonner"

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster theme={"dark"} position="bottom-center" />
    </>
  )
}
