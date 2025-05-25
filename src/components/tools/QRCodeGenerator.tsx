
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, Share2, Wifi, Mail, Phone, MessageSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useUserPreferences } from "@/hooks/useUserPreferences";

export const QRCodeGenerator = () => {
  const [qrType, setQrType] = useState("text");
  const [qrContent, setQrContent] = useState("");
  const [qrSize, setQrSize] = useState("256");
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [generatedQR, setGeneratedQR] = useState("");
  
  // WiFi specific fields
  const [wifiSSID, setWifiSSID] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiSecurity, setWifiSecurity] = useState("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);

  const { preferences, savePreferences, updateUsageCount } = useUserPreferences('qr-code-generator');

  const generateQRCode = () => {
    let content = "";
    
    switch (qrType) {
      case "text":
        content = qrContent;
        break;
      case "url":
        content = qrContent.startsWith("http") ? qrContent : `https://${qrContent}`;
        break;
      case "email":
        content = `mailto:${qrContent}`;
        break;
      case "phone":
        content = `tel:${qrContent}`;
        break;
      case "sms":
        content = `sms:${qrContent}`;
        break;
      case "wifi":
        content = `WIFI:T:${wifiSecurity};S:${wifiSSID};P:${wifiPassword};H:${wifiHidden ? 'true' : 'false'};;`;
        break;
      default:
        content = qrContent;
    }

    if (!content.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir du contenu pour générer le QR code.",
        variant: "destructive",
      });
      return;
    }

    // Generate QR code URL using QR Server API
    const params = new URLSearchParams({
      data: content,
      size: `${qrSize}x${qrSize}`,
      color: qrColor.replace("#", ""),
      bgcolor: bgColor.replace("#", ""),
      format: "png",
      ecc: "M"
    });

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?${params}`;
    setGeneratedQR(qrUrl);
    
    updateUsageCount();
    
    toast({
      title: "QR Code généré !",
      description: "Votre QR code est prêt à être utilisé.",
    });
  };

  const downloadQR = () => {
    if (!generatedQR) return;
    
    const link = document.createElement('a');
    link.href = generatedQR;
    link.download = `qrcode-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Téléchargement",
      description: "Le QR code a été téléchargé.",
    });
  };

  const copyQRUrl = () => {
    if (!generatedQR) return;
    
    navigator.clipboard.writeText(generatedQR);
    toast({
      title: "URL copiée !",
      description: "L'URL du QR code a été copiée dans le presse-papiers.",
    });
  };

  const saveCurrentPreferences = () => {
    const currentPrefs = {
      qrType,
      qrSize,
      qrColor,
      bgColor,
      wifiSecurity
    };
    savePreferences(currentPrefs);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="w-6 h-6" />
          Générateur de QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={qrType} onValueChange={setQrType}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="text">Texte</TabsTrigger>
            <TabsTrigger value="url">URL</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="phone">Téléphone</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
            <TabsTrigger value="wifi">WiFi</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <div>
              <Label htmlFor="text-content">Contenu du QR Code</Label>
              <Textarea
                id="text-content"
                placeholder="Saisissez votre texte ici..."
                value={qrContent}
                onChange={(e) => setQrContent(e.target.value)}
                rows={4}
              />
            </div>
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div>
              <Label htmlFor="url-content">URL du site web</Label>
              <Input
                id="url-content"
                placeholder="https://example.com"
                value={qrContent}
                onChange={(e) => setQrContent(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <div>
              <Label htmlFor="email-content">Adresse email</Label>
              <Input
                id="email-content"
                type="email"
                placeholder="contact@example.com"
                value={qrContent}
                onChange={(e) => setQrContent(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="phone" className="space-y-4">
            <div>
              <Label htmlFor="phone-content">Numéro de téléphone</Label>
              <Input
                id="phone-content"
                placeholder="+33123456789"
                value={qrContent}
                onChange={(e) => setQrContent(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="sms" className="space-y-4">
            <div>
              <Label htmlFor="sms-content">Numéro pour SMS</Label>
              <Input
                id="sms-content"
                placeholder="+33123456789"
                value={qrContent}
                onChange={(e) => setQrContent(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="wifi" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="wifi-ssid">Nom du réseau (SSID)</Label>
                <Input
                  id="wifi-ssid"
                  placeholder="MonWiFi"
                  value={wifiSSID}
                  onChange={(e) => setWifiSSID(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="wifi-password">Mot de passe</Label>
                <Input
                  id="wifi-password"
                  type="password"
                  placeholder="motdepasse123"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="wifi-security">Type de sécurité</Label>
              <Select value={wifiSecurity} onValueChange={setWifiSecurity}>
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
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="size">Taille</Label>
            <Select value={qrSize} onValueChange={setQrSize}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="128">128x128</SelectItem>
                <SelectItem value="256">256x256</SelectItem>
                <SelectItem value="512">512x512</SelectItem>
                <SelectItem value="1024">1024x1024</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="qr-color">Couleur du QR</Label>
            <Input
              id="qr-color"
              type="color"
              value={qrColor}
              onChange={(e) => setQrColor(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="bg-color">Couleur de fond</Label>
            <Input
              id="bg-color"
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={generateQRCode} 
            className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Générer le QR Code
          </Button>
          <Button variant="outline" onClick={saveCurrentPreferences}>
            Sauvegarder les préférences
          </Button>
        </div>

        {generatedQR && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <img 
                src={generatedQR} 
                alt="QR Code généré" 
                className="border border-gray-200 rounded-lg shadow-lg"
              />
            </div>
            
            <div className="flex gap-2 justify-center">
              <Button onClick={downloadQR} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </Button>
              <Button onClick={copyQRUrl} variant="outline">
                <Copy className="w-4 h-4 mr-2" />
                Copier l'URL
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 text-center space-y-1">
              <p>💡 Conseils d'utilisation :</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Testez votre QR code avant de l'imprimer</li>
                <li>Assurez-vous qu'il y a assez de contraste</li>
                <li>Gardez une marge blanche autour du code</li>
                <li>Évitez les tailles trop petites pour l'impression</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
