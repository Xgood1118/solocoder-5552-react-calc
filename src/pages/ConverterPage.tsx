import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import UnitCategoryTabs, { CategoryKey } from '@/components/converter/UnitCategoryTabs'
import UnitConverter from '@/components/converter/UnitConverter'
import BaseConverter from '@/components/converter/BaseConverter'
import { useConverter } from '@/hooks/useConverter'

const ConverterPage: React.FC = () => {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('length')
  const converter = useConverter(activeCategory)

  const isBaseCategory = activeCategory === 'base'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
          {t('app.converter')}
        </h1>

        <UnitCategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {isBaseCategory ? (
          <BaseConverter converter={converter.base} />
        ) : (
          <UnitConverter converter={converter.unit} />
        )}
      </div>
    </div>
  )
}

export default ConverterPage
