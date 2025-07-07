"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { Loader2, FileText, Users, LogOut, User } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

function ComplaintForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.category || !formData.priority) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Your complaint has been submitted successfully!",
        })
        setFormData({ title: "", description: "", category: "", priority: "" })
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to submit complaint")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit complaint. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Submit Complaint
        </CardTitle>
        <CardDescription>Fill out the form below to submit your complaint</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Complaint Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Brief description of your complaint"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of your complaint"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Product">Product</SelectItem>
                <SelectItem value="Service">Service</SelectItem>
                <SelectItem value="Support">Support</SelectItem>
                <SelectItem value="Billing">Billing</SelectItem>
                <SelectItem value="Technical">Technical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <RadioGroup
              value={formData.priority}
              onValueChange={(value) => setFormData({ ...formData, priority: value })}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Low" id="low" />
                <Label htmlFor="low">Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Medium" id="medium" />
                <Label htmlFor="medium">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="High" id="high" />
                <Label htmlFor="high">High</Label>
              </div>
            </RadioGroup>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Complaint"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function AuthenticatedHome() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
<div className=" min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 max-[460px]:w-100vh">
      <div className="max-w-4xl mx-auto ">
        <div className="flex justify-between items-center mb-8 max-[460px]:flex-col">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Complaint Management System</h1>
            <p className="text-lg text-gray-600">Welcome back, {user?.name}!</p>
          </div>
          <div className="flex items-center gap-4 max-md:flex-col max-[460px]:hidden">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              {user?.email} ({user?.role})
            </div>
            <Button variant="outline" onClick={handleLogout} >
              <LogOut className="h-4 w-4 mr-2 " />
              Logout
            </Button>
          </div>
        </div>

        <div className={`grid gap-8 mb-8 ${user?.role !== "admin" ? "md:grid-cols-2" : ""}`}>
          {user?.role !== "admin" && <ComplaintForm />}

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {user?.role === "admin" ? "Admin Dashboard" : "My Complaints"}
              </CardTitle>
              <CardDescription>
                {user?.role === "admin"
                  ? "Access the admin dashboard to manage all complaints"
                  : "View and track your submitted complaints"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                {user?.role === "admin"
                  ? "As an administrator, you can view all submitted complaints, update their status, and manage the resolution process."
                  : "Track the status of your complaints and see their resolution progress."}
              </p>
              <div className="space-y-2">
                <h4 className="font-semibold">{user?.role === "admin" ? "Admin Features:" : "User Features:"}</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {user?.role === "admin" ? (
                    <>
                      <li>• View all complaints in a table format</li>
                      <li>• Filter by status and priority</li>
                      <li>• Update complaint status</li>
                      <li>• View detailed complaint information</li>
                      <li>• Email notifications for updates</li>
                    </>
                  ) : (
                    <>
                      <li>• View your submitted complaints</li>
                      <li>• Track complaint status</li>
                      <li>• Receive email notifications</li>
                      <li>• Submit new complaints</li>
                    </>
                  )}
                </ul>
              </div>
              <Link href={user?.role === "admin" ? "/admin" : "/my-complaints"}>
                <Button className="w-full">
                  {user?.role === "admin" ? "Access Admin Dashboard" : "View My Complaints"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* keep the "How It Works" section for all users */}
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Submit Complaint</h3>
                <p className="text-sm text-gray-600">
                  Fill out the form with your complaint details and submit it to our system.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Admin Review</h3>
                <p className="text-sm text-gray-600">
                  Our administrators receive notifications and review your complaint promptly.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Resolution</h3>
                <p className="text-sm text-gray-600">
                  Track the progress as we work to resolve your complaint efficiently.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


function UnauthenticatedHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Complaint Management System</h1>
          <p className="text-lg text-gray-600 mb-6">Submit your complaints and track their resolution</p>
          <div className="flex justify-center gap-4">
            <Link href="/auth/login">
              <Button size="lg">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg">
                Register
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                For Users
              </CardTitle>
              <CardDescription>Submit and track your complaints</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Submit complaints with detailed information</li>
                <li>• Track complaint status in real-time</li>
                <li>• Receive email notifications on updates</li>
                <li>• View history of all your complaints</li>
              </ul>
              <Link href="/auth/register">
                <Button className="w-full">Register as User</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                For Administrators
              </CardTitle>
              <CardDescription>Manage and resolve complaints</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• View and manage all complaints</li>
                <li>• Update complaint status and priority</li>
                <li>• Filter and search complaints</li>
                <li>• Send automated email notifications</li>
              </ul>
              <Link href="/auth/register">
                <Button className="w-full">Register as Admin</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Create Account</h3>
                <p className="text-sm text-gray-600">Register as a user or administrator to access the system.</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Submit & Manage</h3>
                <p className="text-sm text-gray-600">Users submit complaints while admins manage and resolve them.</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Track Progress</h3>
                <p className="text-sm text-gray-600">
                  Get real-time updates and email notifications on complaint status.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return user ? <AuthenticatedHome /> : <UnauthenticatedHome />
}
