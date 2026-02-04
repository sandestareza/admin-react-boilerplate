import { useRegisterSW } from 'virtual:pwa-register/react'
import { Button } from './ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'

export function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  if (!offlineReady && !needRefresh) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <Card className="w-[350px] shadow-2xl border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            {needRefresh ? "Update Available" : "Offline Ready"}
          </CardTitle>
          <CardDescription>
            {needRefresh 
              ? "New content is available, click on reload button to update." 
              : "App ready to work offline."
            }
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={close}>
            Close
          </Button>
          {needRefresh && (
            <Button size="sm" onClick={() => updateServiceWorker(true)}>
              Reload
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
