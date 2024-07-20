import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from './ui/button';
import LanguageSwitcher from './LanguageSwitcher';

function Header() {
  const t = useTranslations('Header');
  return (
    <div className="w-full bg-primary bg-opacity-70 backdrop-blur-md top-0 left-0 right-0 z-50 drop-shadow-md fixed">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-[15px]">
        <Link href="/" className="logo flex items-center">
          <Image src="/logo.svg" alt="logo" width={160} height={100} />
        </Link>
        <div className="flex gap-2">
          <Button className="ml-auto" variant="outline">
            {t('login_registration')}
          </Button>
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}

export default Header;
