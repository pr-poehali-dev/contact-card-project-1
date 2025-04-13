import ContactCard from "@/components/ContactCard";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <ContactCard 
        name="Петров Сергей"
        position="Технический директор"
        email="petrov@techcompany.ru"
        phone="+7 (999) 765-43-21"
        address="г. Санкт-Петербург, пр. Невский, 42"
      />
    </div>
  );
};

export default Index;
