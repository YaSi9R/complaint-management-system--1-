"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Eye, ArrowLeft, LogOut, User } from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { useAuth } from "@/contexts/AuthContext"

interface Complaint {
  _id: string
  title: string
  description: string
  category: string
  priority: string
  status: string
  dateSubmitted: string
}

function MyComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const { toast } = useToast()
  const { user, logout } = useAuth()

  useEffect(() => {
    fetchComplaints()
  }, [])

  const fetchComplaints = async () => {
    try {
      const response = await fetch("/api/complaints")
      if (response.ok) {
        const data = await response.json()
        setComplaints(data)
      } else {
        throw new Error("Failed to fetch complaints")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch your complaints",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive"
      case "Medium":
        return "default"
      case "Low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "destructive"
      case "In Progress":
        return "default"
      case "Resolved":
        return "secondary"
      default:
        return "default"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Complaints</h1>
                <p className="text-gray-600">Welcome, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                {user?.email}
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
          <p className="text-gray-600">Track and view all your submitted complaints</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{complaints.length}</div>
              <div className="text-sm text-gray-600">Total Complaints</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {complaints.filter((c) => c.status === "Pending").length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {complaints.filter((c) => c.status === "In Progress").length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {complaints.filter((c) => c.status === "Resolved").length}
              </div>
              <div className="text-sm text-gray-600">Resolved</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Complaints</CardTitle>
            <CardDescription>View and track the status of your submitted complaints</CardDescription>
          </CardHeader>
          <CardContent>
            {complaints.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You haven't submitted any complaints yet.</p>
                <Link href="/">
                  <Button>Submit Your First Complaint</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complaints.map((complaint) => (
                      <TableRow key={complaint._id}>
                        <TableCell className="font-medium">{complaint.title}</TableCell>
                        <TableCell>{complaint.category}</TableCell>
                        <TableCell>
                          <Badge variant={getPriorityColor(complaint.priority)}>{complaint.priority}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(complaint.status)}>{complaint.status}</Badge>
                        </TableCell>
                        <TableCell>{new Date(complaint.dateSubmitted).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedComplaint(complaint)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{selectedComplaint?.title}</DialogTitle>
                                <DialogDescription>Complaint Details</DialogDescription>
                              </DialogHeader>
                              {selectedComplaint && (
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold">Description:</h4>
                                    <p className="text-sm text-gray-600">{selectedComplaint.description}</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold">Category:</h4>
                                      <p className="text-sm">{selectedComplaint.category}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold">Priority:</h4>
                                      <Badge variant={getPriorityColor(selectedComplaint.priority)}>
                                        {selectedComplaint.priority}
                                      </Badge>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold">Status:</h4>
                                      <Badge variant={getStatusColor(selectedComplaint.status)}>
                                        {selectedComplaint.status}
                                      </Badge>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold">Date Submitted:</h4>
                                      <p className="text-sm">
                                        {new Date(selectedComplaint.dateSubmitted).toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function MyComplaintsPageWrapper() {
  return (
    <ProtectedRoute>
      <MyComplaintsPage />
    </ProtectedRoute>
  )
}
