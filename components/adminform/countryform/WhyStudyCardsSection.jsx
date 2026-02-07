// components/admin/country/WhyStudyCardsSection.jsx
import WhyStudyCard from "./WhyStudyCard";

export default function WhyStudyCardsSection({
  cards,
  countryName,
  onCardChange,
  onAddCard,
  onRemoveCard,
  errors,
  isViewMode,
}) {
  const hasCards = cards.length > 0;

  return (
    <div className="space-y-6 bg-gray-50 rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">
          Why Study in {countryName} Cards
        </h3>
        {!isViewMode && (
          <button
            type="button"
            onClick={onAddCard}
            className="px-5 py-2.5 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors font-medium flex items-center gap-2"
          >
            + Add New Card
          </button>
        )}
      </div>

      {hasCards ? (
        <div className="space-y-8">
          {cards.map((card, index) => (
            <WhyStudyCard
              key={index}
              index={index}
              card={card}
              onChange={onCardChange}
              onRemove={onRemoveCard}
              canRemove={cards.length > 1}
              errors={errors}
              isViewMode={isViewMode}
            />
          ))}
        </div>
      ) : (
        !isViewMode && (
          <p className="text-center text-gray-500 py-8">
            No cards added yet. Click "Add New Card" to create content.
          </p>
        )
      )}
    </div>
  );
}