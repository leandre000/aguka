import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, Calendar, Edit } from "lucide-react";
import { EmployeePortalLayout } from "@/components/layouts/EmployeePortalLayout";
import { getCurrentUserProfile, updateCurrentUserProfile } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";

export default function EmployeeProfile() {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getCurrentUserProfile();
        setProfile(data);
        
        // Initialize form data
        if (data?.user) {
          const names = data.user.Names?.split(' ') || ['', ''];
          setFormData({
            firstName: names[0] || '',
            lastName: names[1] || '',
            email: data.user.Email || '',
            phone: data.user.phone || '',
            address: data.employee?.address || ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle save
  const handleSave = async () => {
    try {
      setSaving(true);
      
      const userData = {
        Names: `${formData.firstName} ${formData.lastName}`.trim(),
        Email: formData.email,
        phone: formData.phone
      };
      
      const employeeData = {
        address: formData.address
      };
      
      const updatedProfile = await updateCurrentUserProfile({
        userData,
        employeeData
      });
      
      setProfile(updatedProfile);
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (profile?.user) {
      const names = profile.user.Names?.split(' ') || ['', ''];
      setFormData({
        firstName: names[0] || '',
        lastName: names[1] || '',
        email: profile.user.Email || '',
        phone: profile.user.phone || '',
        address: profile.employee?.address || ''
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <EmployeePortalLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-32 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="h-64 bg-muted rounded"></div>
              </div>
              <div className="md:col-span-2">
                <div className="h-96 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </EmployeePortalLayout>
    );
  }

  return (
    <EmployeePortalLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Profile</h1>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              {t("common.edit")}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                {t("common.cancel")}
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : t("common.save")}
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar className="w-32 h-32">
                <AvatarImage src={profile?.user?.profilePicture || "/placeholder.svg"} />
                <AvatarFallback>
                  {profile?.user?.Names?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" disabled={!isEditing}>
                Change Photo
              </Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      className="pl-10"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    className="pl-10"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" value={profile?.user?.department || 'Not assigned'} readOnly />
                </div>
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={profile?.employee?.position || 'Not assigned'}
                    readOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="startDate"
                      className="pl-10"
                      value={profile?.employee?.startDate ? new Date(profile.employee.startDate).toLocaleDateString() : 'Not assigned'}
                      readOnly
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input id="employeeId" value={profile?.employee?._id || profile?.user?._id || 'Not assigned'} readOnly />
                </div>
              </div>


            </CardContent>
          </Card>
        </div>
      </div>
    </EmployeePortalLayout>
  );
}
