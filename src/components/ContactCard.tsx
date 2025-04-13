import { Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ContactCardProps {
  name: string;
  position: string;
  email: string;
  phone: string;
  address: string;
  avatarUrl?: string;
}

const ContactCard = ({
  name = "Иванов Иван",
  position = "Менеджер по продажам",
  email = "ivanov@company.ru",
  phone = "+7 (900) 123-45-67",
  address = "г. Москва, ул. Примерная, 123",
  avatarUrl,
}: ContactCardProps) => {
  return (
    <Card className="w-full max-w-md border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={name} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600">{position}</p>
          </div>
        </div>
        
        <div className="mt-6 space-y-3">
          <div className="flex items-center">
            <Phone className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm">{phone}</span>
          </div>
          
          <div className="flex items-center">
            <Mail className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm">{email}</span>
          </div>
          
          <div className="flex items-start">
            <MapPin className="h-4 w-4 text-primary mr-2 mt-0.5" />
            <span className="text-sm">{address}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
