"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Loader2, Eye, Filter, ArrowLeft, LogOut, User } from "lucide-react"
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
  userName: string
  userEmail: string
}

function AdminDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const { toast } = useToast()
  const { user, logout } = useAuth()

  useEffect(() => {
    fetchComplaints()
  }, [])

  useEffect(() => {
    filterComplaints()
  }, [complaints, statusFilter, priorityFilter])

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
        description: "Failed to fetch complaints",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterComplaints = () => {
    let filtered = complaints
    if (statusFilter !== "all") {
      filtered = filtered.filter((complaint) => complaint.status === statusFilter)
    }
    if (priorityFilter !== "all") {
      filtered = filtered.filter((complaint) => complaint.priority === priorityFilter)
    }
    setFilteredComplaints(filtered)
  }

  const updateComplaintStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/complaints/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        toast({ title: "Success", description: "Complaint status updated successfully" })
        fetchComplaints()
      } else {
        throw new Error("Failed to update complaint")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update complaint status",
        variant: "destructive",
      })
    }
  }

  const deleteComplaint = async (id: string) => {
    if (!confirm("Are you sure you want to delete this complaint?")) return
    try {
      const response = await fetch(`/api/complaints/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast({ title: "Success", description: "Complaint deleted successfully" })
        fetchComplaints()
      } else {
        throw new Error("Failed to delete complaint")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete complaint",
        variant: "destructive",
      })
    }
  }

  const handleLogout = async () => { try { await logout() } catch (error) { console.error("Logout failed:", error) } }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "destructive"
      case "Medium": return "default"
      case "Low": return "secondary"
      default: return "default"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "destructive"
      case "In Progress": return "default"
      case "Resolved": return "secondary"
      default: return "default"
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>

  return (
    <div className="min-h-screen bg-gray-50 p-4 w-full h-full">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" /> {user?.email}
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-600">Manage and track all submitted complaints</p>
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
            <CardTitle>Complaints Management</CardTitle>
            <CardDescription>View, filter, and manage all submitted complaints</CardDescription>
            <div className="flex gap-4   max-[410px]:flex-col ">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mr-3">
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40 ">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComplaints.map((complaint) => (
                    <TableRow key={complaint._id}>
                      <TableCell className="font-medium">{complaint.title}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{complaint.userName}</div>
                          <div className="text-sm text-gray-500">{complaint.userEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>{complaint.category}</TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(complaint.priority)}>{complaint.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={complaint.status}
                          onValueChange={(value) => updateComplaintStatus(complaint._id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{new Date(complaint.dateSubmitted).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
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
                                      <h4 className="font-semibold">Submitted by:</h4>
                                      <p className="text-sm">{selectedComplaint.userName}</p>
                                      <p className="text-sm text-gray-500">{selectedComplaint.userEmail}</p>
                                    </div>
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
                          <Button variant="destructive" size="sm" onClick={() => deleteComplaint(complaint._id)}>
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredComplaints.length === 0 && (
              <div className="text-center py-8 text-gray-500">No complaints found matching the current filters.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminDashboard />
    </ProtectedRoute>
  )
}
