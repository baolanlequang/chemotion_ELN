class DetailLevels::Reaction
  def base_attributes
    [
      :id, :type, :name, :created_at, :updated_at, :description,
      :timestamp_start, :timestamp_stop,
      :observation, :purification, :dangerous_products, :solvent,
      :tlc_solvents, :tlc_description,
      :rf_value, :temperature, :status, :reaction_svg_file,
      :short_label, :container
    ]
  end

  def level0_attributes
    [
      :id, :type, :is_restricted, :observation, :description
    ]
  end

  def list_removed_attributes
    [
      :description, :timestamp_start, :timestamp_stop, :dangerous_products,
      :observation, :purification, :solvent, :tlc_solvents, :tlc_description,
      :rf_value, :temperature, :status, :container
    ]
  end
end
