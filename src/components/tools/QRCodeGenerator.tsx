import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import QRCode from "qrcode";
import { Download, Share2, Copy, Smartphone, Wifi, Mail, Phone, MessageSquare, Globe, User, Palette } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useUserPreferences } from "@/hooks/useUserPreferences";

type QRErrorCorrectionLevel = "L" | "M" | "Q" | "H";

interface QROptions {
  errorCorrectionLevel: QRErrorCorrectionLevel;
  width: number;
  margin: number;
  color: {
    dark: string;
    light: string;
  };
}

export const QRCodeGenerator = () => {
  const [qrData, setQrData] = useState("");
  const [qrImage, setQrImage] = useState("");
  const [activeTab, setActiveTab] = useState("text");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Customization options
  const [qrOptions, setQrOptions] = useState<QROptions>({
    errorCorrectionLevel: "M",
    width: 300,
    margin: 4,
    color: {
      dark: "#000000",
      light: "#FFFFFF"
    }
  });
  
  // Form data for different types
  const [formData, setFormData] = useState({
    text: "",
    url: "",
    email: { address: "", subject: "", body: "" },
    phone: "",
    sms: { number: "", message: "" },
    wifi: { ssid: "", password: "", security: "WPA", hidden: false },
    contact: { name: "", phone: "", email: "", organization: "" }
  });

  const { preferences, savePreferences } = useUserPreferences("qr-generator");

  // Load saved preferences
  useEffect(() => {
    if (preferences.qrOptions) {
      setQrOptions({ ...qrOptions, ...preferences.qrOptions });
    }
    if (preferences.activeTab) {
      setActiveTab(preferences.activeTab);
    }
  }, [preferences]);

  const generateQRCode = useCallback(async (data: string) => {
    if (!data.trim()) {
      setQrImage("");
      return;
    }

    setIsGenerating(true);
    try {
      const url = await QRCode.toDataURL(data, qrOptions);
      setQrImage(url);
    } catch (error) {
      console.error("Erreur lors de la génération du QR code:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le QR code",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [qrOptions]);

  const formatDataForType = (type: string) => {
    switch (type) {
      case "text":
        return formData.text;
      case "url":
        return formData.url.startsWith("http") ? formData.url : `https://${formData.url}`;
      case "email":
        return `mailto:${formData.email.address}?subject=${encodeURIComponent(formData.email.subject)}&body=${encodeURIComponent(formData.email.body)}`;
      case "phone":
        return `tel:${formData.phone}`;
      case "sms":
        return `sms:${formData.sms.number}?body=${encodeURIComponent(formData.sms.message)}`;
      case "wifi":
        return `WIFI:T:${formData.wifi.security};S:${formData.wifi.ssid};P:${formData.wifi.password};H:${formData.wifi.hidden ? "true" : "false"};;`;
      case "contact":
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${formData.contact.name}\nTEL:${formData.contact.phone}\nEMAIL:${formData.contact.email}\nORG:${formData.contact.organization}\nEND:VCARD`;
      default:
        return "";
    }
  };

  useEffect(() => {
    const data = formatDataForType(activeTab);
    setQrData(data);
    generateQRCode(data);
  }, [activeTab, formData, generateQRCode]);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    savePreferences({ ...preferences, activeTab: newTab });
  };

  const handleOptionsChange = (newOptions: Partial<QROptions>) => {
    const updatedOptions = { ...qrOptions, ...newOptions };
    setQrOptions(updatedOptions);
    savePreferences({ ...preferences, qrOptions: updatedOptions });
  };

  const downloadQR = () => {
    if (!qrImage) return;
    const link = document.createElement("a");
    link.download = `qr-code-${activeTab}-${Date.now()}.png`;
    link.href = qrImage;
    link.click();
    
    toast({
      title: "QR Code téléchargé",
      description: "Le QR code a été sauvegardé sur votre appareil",
    });
  };

  const copyToClipboard = async () => {
    if (!qrData) return;
    try {
      await navigator.clipboard.writeText(qrData);
      toast({
        title: "Copié",
        description: "Le contenu du QR code a été copié dans le presse-papiers",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le contenu",
        variant: "destructive",
      });
    }
  };

  const shareQR = async () => {
    if (!navigator.share || !qrImage) return;
    
    try {
      const response = await fetch(qrImage);
      const blob = await response.blob();
      const file = new File([blob], `qr-code-${activeTab}.png`, { type: "image/png" });
      
      await navigator.share({
        title: "QR Code généré",
        text: `QR Code pour: ${qrData}`,
        files: [file]
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de partager le QR code",
        variant: "destructive",
      });
    }
  };

  const tabIcons = {
    text: MessageSquare,
    url: Globe,
    email: Mail,
    phone: Phone,
    sms: MessageSquare,
    wifi: Wifi,
    contact: User
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Générateur QR Code Avancé
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Créez des QR codes personnalisés pour tous vos besoins
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Configuration du QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid grid-cols-4 lg:grid-cols-7 h-auto">
                {Object.entries(tabIcons).map(([key, Icon]) => (
                  <TabsTrigger key={key} value={key} className="flex flex-col gap-1 p-2">
                    <Icon className="w-4 h-4" />
                    <span className="text-xs capitalize">{key}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="text" className="space-y-4">
                <div>
                  <Label htmlFor="text-input">Texte à encoder</Label>
                  <Textarea
                    id="text-input"
                    placeholder="Entrez votre texte ici..."
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    rows={4}
                  />
                </div>
              </TabsContent>

              <TabsContent value="url" className="space-y-4">
                <div>
                  <Label htmlFor="url-input">URL du site web</Label>
                  <Input
                    id="url-input"
                    placeholder="exemple.com ou https://exemple.com"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  />
                </div>
              </TabsContent>

              <TabsContent value="email" className="space-y-4">
                <div>
                  <Label htmlFor="email-address">Adresse email</Label>
                  <Input
                    id="email-address"
                    type="email"
                    placeholder="contact@exemple.com"
                    value={formData.email.address}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      email: { ...formData.email, address: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="email-subject">Sujet (optionnel)</Label>
                  <Input
                    id="email-subject"
                    placeholder="Sujet de l'email"
                    value={formData.email.subject}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      email: { ...formData.email, subject: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="email-body">Message (optionnel)</Label>
                  <Textarea
                    id="email-body"
                    placeholder="Corps du message"
                    value={formData.email.body}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      email: { ...formData.email, body: e.target.value }
                    })}
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="phone" className="space-y-4">
                <div>
                  <Label htmlFor="phone-number">Numéro de téléphone</Label>
                  <Input
                    id="phone-number"
                    placeholder="+33 1 23 45 67 89"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </TabsContent>

              <TabsContent value="sms" className="space-y-4">
                <div>
                  <Label htmlFor="sms-number">Numéro de téléphone</Label>
                  <Input
                    id="sms-number"
                    placeholder="+33 1 23 45 67 89"
                    value={formData.sms.number}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      sms: { ...formData.sms, number: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="sms-message">Message (optionnel)</Label>
                  <Textarea
                    id="sms-message"
                    placeholder="Votre message SMS"
                    value={formData.sms.message}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      sms: { ...formData.sms, message: e.target.value }
                    })}
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="wifi" className="space-y-4">
                <div>
                  <Label htmlFor="wifi-ssid">Nom du réseau (SSID)</Label>
                  <Input
                    id="wifi-ssid"
                    placeholder="MonWiFi"
                    value={formData.wifi.ssid}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      wifi: { ...formData.wifi, ssid: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="wifi-password">Mot de passe</Label>
                  <Input
                    id="wifi-password"
                    type="password"
                    placeholder="Mot de passe WiFi"
                    value={formData.wifi.password}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      wifi: { ...formData.wifi, password: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="wifi-security">Type de sécurité</Label>
                  <Select 
                    value={formData.wifi.security} 
                    onValueChange={(value) => setFormData({ 
                      ...formData, 
                      wifi: { ...formData.wifi, security: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WPA">WPA/WPA2</SelectItem>
                      <SelectItem value="WEP">WEP</SelectItem>
                      <SelectItem value="nopass">Aucune</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-4">
                <div>
                  <Label htmlFor="contact-name">Nom complet</Label>
                  <Input
                    id="contact-name"
                    placeholder="Jean Dupont"
                    value={formData.contact.name}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      contact: { ...formData.contact, name: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="contact-phone">Téléphone</Label>
                  <Input
                    id="contact-phone"
                    placeholder="+33 1 23 45 67 89"
                    value={formData.contact.phone}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      contact: { ...formData.contact, phone: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="jean@exemple.com"
                    value={formData.contact.email}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      contact: { ...formData.contact, email: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="contact-org">Organisation (optionnel)</Label>
                  <Input
                    id="contact-org"
                    placeholder="Nom de l'entreprise"
                    value={formData.contact.organization}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      contact: { ...formData.contact, organization: e.target.value }
                    })}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <Separator />

            {/* Customization Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Personnalisation
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="qr-size">Taille</Label>
                  <Select 
                    value={qrOptions.width.toString()} 
                    onValueChange={(value) => handleOptionsChange({ width: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="200">Petit (200px)</SelectItem>
                      <SelectItem value="300">Moyen (300px)</SelectItem>
                      <SelectItem value="400">Grand (400px)</SelectItem>
                      <SelectItem value="500">Très grand (500px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="qr-correction">Correction d'erreur</Label>
                  <Select 
                    value={qrOptions.errorCorrectionLevel} 
                    onValueChange={(value: QRErrorCorrectionLevel) => handleOptionsChange({ errorCorrectionLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Faible (7%)</SelectItem>
                      <SelectItem value="M">Moyen (15%)</SelectItem>
                      <SelectItem value="Q">Élevé (25%)</SelectItem>
                      <SelectItem value="H">Très élevé (30%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="qr-dark">Couleur sombre</Label>
                  <Input
                    id="qr-dark"
                    type="color"
                    value={qrOptions.color.dark}
                    onChange={(e) => handleOptionsChange({ 
                      color: { ...qrOptions.color, dark: e.target.value }
                    })}
                  />
                </div>

                <div>
                  <Label htmlFor="qr-light">Couleur claire</Label>
                  <Input
                    id="qr-light"
                    type="color"
                    value={qrOptions.color.light}
                    onChange={(e) => handleOptionsChange({ 
                      color: { ...qrOptions.color, light: e.target.value }
                    })}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Display */}
        <Card>
          <CardHeader>
            <CardTitle>QR Code généré</CardTitle>
            <CardDescription>
              Scannez avec votre smartphone ou téléchargez l'image
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              {qrImage ? (
                <div className="relative group">
                  <img 
                    src={qrImage} 
                    alt="QR Code" 
                    className="border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                  />
                  {isGenerating && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center rounded-lg">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-[300px] h-[300px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <Smartphone className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Remplissez les champs pour générer un QR code</p>
                  </div>
                </div>
              )}
            </div>

            {qrImage && (
              <>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button onClick={downloadQR} className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Télécharger
                  </Button>
                  <Button variant="outline" onClick={copyToClipboard} className="flex items-center gap-2">
                    <Copy className="w-4 h-4" />
                    Copier le contenu
                  </Button>
                  {navigator.share && (
                    <Button variant="outline" onClick={shareQR} className="flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Partager
                    </Button>
                  )}
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge variant="secondary">{activeTab.toUpperCase()}</Badge>
                    Contenu encodé
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 break-all font-mono bg-white dark:bg-gray-900 p-3 rounded border">
                    {qrData}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
