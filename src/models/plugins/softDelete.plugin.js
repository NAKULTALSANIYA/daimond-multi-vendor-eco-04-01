export const softDeletePlugin = (schema) => {
  schema.add({
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  });

  schema.methods.softDelete = function softDelete() {
    this.isDeleted = true;
    this.deletedAt = new Date();
    return this.save();
  };

  schema.pre(/^find/, function hideDeleted(next) {
    if (!this.getOptions().withDeleted) {
      this.where({ isDeleted: false });
    }
    next();
  });
};
