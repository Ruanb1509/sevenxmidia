import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Edit2, Mail, MapPin, Calendar, Trophy, Settings } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import Header from "../components/Header";

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, loading } = useAuth();


    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                </div>
            </div>
        );
    }

    const memberSince = new Date(user.createdAt || Date.now()).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
            <Header />
            
            <div className="max-w-4xl mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Profile Header Card */}
                    <Card className="border-2 mb-8 overflow-hidden">
                        <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10" />
                        
                        <div className="px-8 pb-8">
                            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 relative z-10">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full bg-primary/20 border-4 border-background flex items-center justify-center shadow-lg">
                                        <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-4xl font-bold text-white">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <button className="absolute bottom-0 right-0 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* User Info */}
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                                    <p className="text-muted-foreground flex items-center gap-2 mb-4">
                                        <Mail className="w-4 h-4" />
                                        {user.email}
                                    </p>
                                    {user.isVip && (
                                        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                                            <Trophy className="w-4 h-4" />
                                            Active Subscriber
                                        </div>
                                    )}
                                </div>

                                <Button className="gap-2" onClick={() => navigate("/settings")}>
                                    <Edit2 className="w-4 h-4" />
                                    Edit Profile
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Stats Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <Card className="p-6 text-center">
                            <div className="text-3xl font-bold text-primary mb-2">1</div>
                            <p className="text-muted-foreground">Active Sites</p>
                        </Card>
                        <Card className="p-6 text-center">
                            <div className="text-3xl font-bold text-primary mb-2">842K</div>
                            <p className="text-muted-foreground">Impressions (30d)</p>
                        </Card>
                        <Card className="p-6 text-center">
                            <div className="text-3xl font-bold text-primary mb-2">$1.53</div>
                            <p className="text-muted-foreground">Avg. RPM</p>
                        </Card>
                    </div>

                    {/* Account Details */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Account Info */}
                        <Card className="p-6">
                            <h2 className="text-xl font-bold mb-6">Account Information</h2>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Full Name</p>
                                    <p className="font-medium">{user.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Email Address</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Member Since</p>
                                    <p className="font-medium flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {memberSince}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Account Type</p>
                                    <p className="font-medium">{user.isAdmin ? "Administrator" : user.isVip ? "Subscriber" : "Free"}</p>
                                </div>
                            </div>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="p-6">
                            <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
                            <div className="space-y-3">
                                <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/dashboard")}>
                                    View Dashboard
                                </Button>
                                <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/dashboard")}>
                                    Get Optimization Script
                                </Button>
                                <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/dashboard")}>
                                    Revenue Reports
                                </Button>
                                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate("/settings")}>
                                    <Settings className="w-4 h-4" />
                                    Go to Settings
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Recent Activity */}
                    <Card className="p-6 mt-8">
                        <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
                        <div className="space-y-4">
                            {[
                                { title: "Network selection updated for US traffic", when: "2 hours ago", value: "+$4.20 est. daily" },
                                { title: "Optimization script verified on your site", when: "1 day ago", value: "Active" },
                                { title: "Monthly revenue report generated", when: "3 days ago", value: "$1,284.50" },
                            ].map((item) => (
                                <div key={item.title} className="flex items-center justify-between pb-4 border-b last:border-b-0">
                                    <div>
                                        <p className="font-medium">{item.title}</p>
                                        <p className="text-sm text-muted-foreground">{item.when}</p>
                                    </div>
                                    <span className="text-sm font-medium text-primary">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;
