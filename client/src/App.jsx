import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function App() {
  return (
    <>
      {/* Hero Section */}
      <div className="flex min-h-svh flex-col items-center justify-center p-8">
        <Button className="px-6 py-2 hover:scale-105 transition-transform">
          Click me
        </Button>
      </div>

      {/* Card Section */}
      <div className="max-w-md mx-auto p-6">
        <Card className="shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold">Card Title</CardTitle>
            <CardDescription className="text-gray-600">
              Card Description
            </CardDescription>
            <CardAction>Card Action</CardAction>
          </CardHeader>
          <CardContent className="py-4">
            <p>Card Content</p>
          </CardContent>
          <CardFooter className="bg-gray-50">
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      </div>
    </>

    //34.56
  )
}

export default App
