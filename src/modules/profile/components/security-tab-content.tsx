import { useTranslation } from "react-i18next";
import { Fingerprint } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export function SecurityTabContent() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <Card className="border-orange-100 shadow-sm dark:border-orange-900">
        <CardHeader>
          <CardTitle className="text-orange-700 dark:text-orange-500 text-lg md:text-xl">{t('profile.security.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Item 1 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
            <div>
              <p className="font-medium text-gray-900 dark:text-orange-500 mb-1">{t('profile.security.tfa')}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('profile.security.tfa_desc')}
              </p>
            </div>
            <Button variant="outline" className="w-full sm:w-auto border-gray-300 text-gray-900 hover:bg-orange-50">
              <Fingerprint className="mr-2 h-4 w-4 text-orange-500" /> {t('profile.security.enable')}
            </Button>
          </div>

          {/* Item 2 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-medium text-gray-900 dark:text-orange-500 mb-1">{t('profile.security.pwd_label')}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('profile.security.last_changed', { time: '3 ' + (localStorage.getItem('i18nextLng') === 'vi' ? 'tháng' : 'months') })}
              </p>
            </div>
            <Button variant="outline" className="w-full sm:w-auto border-gray-300 text-gray-900 hover:bg-orange-50">
              {t('profile.security.change')}
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}