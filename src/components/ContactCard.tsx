import { Mail, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ContactCardProps {
  name: string;
  position: string;
  email: string;
  phone: string;
  avatarUrl?: string;
}

const ContactCard = ({
  name = "Иванов Иван",
  position = "Менеджер",
  email = "mail@example.ru",
  phone = "+7 (900) 123-45-67",
  avatarUrl,
}: ContactCardProps) => {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 max-w-xs hover:shadow-md transition-shadow">
      <Avatar className="h-12 w-12 mr-4">
        <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={name} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-medium text-gray-900 truncate">{name}</h3>
        <p className="text-xs text-gray-500 mb-1">{position}</p>
        
        <div className="flex items-center text-xs text-gray-600 mt-1">
          <Phone className="h-3 w-3 text-primary mr-1" />
          <span className="truncate">{phone}</span>
        </div>
        
        <div className="flex items-center text-xs text-gray-600 mt-1">
          <Mail className="h-3 w-3 text-primary mr-1" />
          <span className="truncate">{email}</span>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
