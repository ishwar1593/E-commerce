import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Navbar from '../components/Navbar'

const SignInPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [resetEmail, setResetEmail] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle sign in logic here
    console.log('Sign in:', formData)
  }

  const handleForgotPassword = (e) => {
    e.preventDefault()
    // Handle password reset logic here
    console.log('Password reset requested for:', resetEmail)
    setIsDialogOpen(false)
    // You would typically show a success message here
    alert('If an account exists with this email, you will receive password reset instructions.')
    setResetEmail('')
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="link"
                      className="text-sm text-blue-500 hover:text-blue-700 p-0"
                    >
                      Forgot password?
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reset Password</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleForgotPassword} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="resetEmail">Email</Label>
                        <Input
                          id="resetEmail"
                          type="email"
                          placeholder="Enter your email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Send Reset Link
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:text-blue-700">
              Sign up
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  )
}

export default SignInPage