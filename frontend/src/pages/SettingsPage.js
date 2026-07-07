import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
    Bell, Lock, Globe, Eye, Trash2, LogOut, Save, ChevronRight, Moon, Sun, Zap
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import Header from "../components/Header";

const SettingsPage = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout, loading } = useAuth();
    const { theme, setTheme } = useTheme();
    const [settings, setSettings] = React.useState({
        emailNotifications: true,
        marketingEmails: false,
        twoFactor: false,
        publicProfile: true,
        dataCollection: true,
    });

    // Cobranças são gerenciadas pelo Whop (processador de pagamento)
    const openWhopOrders = () => {
        window.open("https://whop.com/orders", "_blank", "noopener");
    };


    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleSettingChange = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

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

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
            <Header />
            
            <div className="max-w-4xl mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Settings</h1>
                        <p className="text-muted-foreground">Manage your account preferences and security options</p>
                    </div>

                    {/* Notification Settings */}
                    <Card className="p-6 mb-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Bell className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-bold">Notifications</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Email Notifications</p>
                                    <p className="text-sm text-muted-foreground">Receive updates about your campaigns</p>
                                </div>
                                <Switch 
                                    checked={settings.emailNotifications}
                                    onCheckedChange={() => handleSettingChange('emailNotifications')}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Marketing Emails</p>
                                    <p className="text-sm text-muted-foreground">Receive promotional content and offers</p>
                                </div>
                                <Switch 
                                    checked={settings.marketingEmails}
                                    onCheckedChange={() => handleSettingChange('marketingEmails')}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Security Settings */}
                    <Card className="p-6 mb-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Lock className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-bold">Security</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Two-Factor Authentication</p>
                                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                                </div>
                                <Switch 
                                    checked={settings.twoFactor}
                                    onCheckedChange={() => handleSettingChange('twoFactor')}
                                />
                            </div>
                            <Button variant="outline" className="w-full justify-between">
                                Change Password
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" className="w-full justify-between">
                                Active Sessions
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </Card>

                    {/* Privacy Settings */}
                    <Card className="p-6 mb-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Globe className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-bold">Privacy & Visibility</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Public Profile</p>
                                    <p className="text-sm text-muted-foreground">Allow others to see your profile</p>
                                </div>
                                <Switch 
                                    checked={settings.publicProfile}
                                    onCheckedChange={() => handleSettingChange('publicProfile')}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Data Collection</p>
                                    <p className="text-sm text-muted-foreground">Allow analytics and performance tracking</p>
                                </div>
                                <Switch 
                                    checked={settings.dataCollection}
                                    onCheckedChange={() => handleSettingChange('dataCollection')}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Appearance Settings */}
                    <Card className="p-6 mb-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Sun className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-bold">Appearance</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Dark Mode</p>
                                    <p className="text-sm text-muted-foreground">Use dark theme for the interface</p>
                                </div>
                                <Switch
                                    checked={theme === "dark"}
                                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Billing & Account */}
                    <Card className="p-6 mb-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Zap className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-bold">Billing & Account</h2>
                        </div>
                        <div className="space-y-3">
                            <Button variant="outline" className="w-full justify-between" onClick={openWhopOrders}>
                                View Billing History (Whop)
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" className="w-full justify-between" onClick={() => navigate("/#pricing")}>
                                Upgrade Plan
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" className="w-full justify-between" onClick={openWhopOrders}>
                                Payment Methods (Whop)
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                Payments and receipts are managed by Whop, our checkout provider.
                            </p>
                        </div>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="p-6 border-red-200 bg-red-50 dark:bg-red-950/20 mb-8">
                        <h2 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h2>
                        <div className="space-y-3">
                            <Button variant="destructive" className="w-full justify-start gap-2">
                                <Trash2 className="w-4 h-4" />
                                Delete Account
                            </Button>
                            <Button variant="destructive" className="w-full justify-start gap-2" onClick={handleLogout}>
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </Button>
                        </div>
                    </Card>

                    {/* Save Changes */}
                    <div className="flex justify-end gap-3">
                        <Button variant="outline">Cancel</Button>
                        <Button className="gap-2">
                            <Save className="w-4 h-4" />
                            Save Changes
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SettingsPage;
