/**
 * WordPress dependencies
 */
import {
	Button,
	ExternalLink,
	PanelBody,
	PanelRow,
	ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './style.css';
import AMPValidationErrorsIcon from '../../images/amp-validation-errors.svg';
import AMPValidationErrorsKeptIcon from '../../images/amp-validation-errors-kept.svg';
import { Loading } from '../components/loading';
import { Error } from './error';
import { BLOCK_VALIDATION_STORE_KEY } from './store';

/**
 * Editor sidebar.
 */
export function Sidebar() {
	const { setIsShowingReviewed } = useDispatch( BLOCK_VALIDATION_STORE_KEY );
	const { autosave, savePost } = useDispatch( 'core/editor' );

	const {
		ampCompatibilityBroken,
		isEditedPostNew,
		isDraft,
		isFetchingErrors,
		isPostDirty,
		isShowingReviewed,
		reviewLink,
	} = useSelect( ( select ) => ( {
		ampCompatibilityBroken: select( BLOCK_VALIDATION_STORE_KEY ).getAMPCompatibilityBroken(),
		isEditedPostNew: select( 'core/editor' ).isEditedPostNew(),
		isDraft: [ 'draft', 'auto-draft' ].indexOf( select( 'core/editor' )?.getEditedPostAttribute( 'status' ) ) !== -1,
		isFetchingErrors: select( BLOCK_VALIDATION_STORE_KEY ).getIsFetchingErrors(),
		isPostDirty: select( BLOCK_VALIDATION_STORE_KEY ).getIsPostDirty(),
		isShowingReviewed: select( BLOCK_VALIDATION_STORE_KEY ).getIsShowingReviewed(),
		reviewLink: select( BLOCK_VALIDATION_STORE_KEY ).getReviewLink(),
	} ), [] );

	const {
		displayedErrors,
		hasReviewedValidationErrors,
		validationErrors,
	} = useSelect( ( select ) => {
		const allErrors = select( BLOCK_VALIDATION_STORE_KEY ).getValidationErrors();
		const unreviewedErrors = select( BLOCK_VALIDATION_STORE_KEY ).getUnreviewedValidationErrors();

		return {
			displayedErrors: isShowingReviewed ? allErrors : unreviewedErrors,
			hasReviewedValidationErrors: select( BLOCK_VALIDATION_STORE_KEY ).getReviewedValidationErrors()?.length > 0,
			validationErrors: allErrors,
		};
	}, [ isShowingReviewed ] );

	/**
	 * Focus the first focusable element when the sidebar opens.
	 */
	useEffect( () => {
		const element = document.querySelector( '.amp-sidebar a, .amp-sidebar button, .amp-sidebar input' );
		if ( element ) {
			element.focus();
		}
	}, [] );

	return (
		<div className="amp-sidebar">
			{ ampCompatibilityBroken && (
				<div className="amp-sidebar__broken-container">
					<div className="amp-sidebar__broken">
						<div className="amp-sidebar__validation-errors-kept-icon">
							<AMPValidationErrorsKeptIcon />
						</div>
						<div>
							<h3>
								{ __( 'Invalid markup kept', 'amp' ) }
							</h3>
							{ __( 'The permalink will not be served as valid AMP.', 'amp' ) }
						</div>
					</div>
				</div>
			) }
			{ 0 < validationErrors.length && (
				<PanelBody opened={ true } className="amp-sidebar__description-panel">
					<div className="amp-sidebar__validation-errors-icon">
						<AMPValidationErrorsIcon />
					</div>
					<div className="amp-sidebar__validation-errors-heading">
						<h2>
							{ __( 'Validation Issues', 'amp' ) }
						</h2>

						<p>
							{ reviewLink && (
								<ExternalLink href={ reviewLink } className="amp-sidebar__review-link">
									{ __( 'View technical details', 'amp' ) }
								</ExternalLink>
							) }
						</p>
					</div>
					{ hasReviewedValidationErrors && (
						<div className="amp-sidebar__options">
							<ToggleControl
								checked={ isShowingReviewed }
								label={ __( 'Include reviewed issues', 'amp' ) }
								onChange={ ( newIsShowingReviewed ) => {
									setIsShowingReviewed( newIsShowingReviewed );
								} }
							/>
						</div>
					) }
				</PanelBody>
			) }

			{ isFetchingErrors ? (
				<PanelBody opened={ true }>
					<Loading />
				</PanelBody>
			) : (
				<>
					{ ! isPostDirty && validationErrors.length === 0 && (
						<PanelBody opened={ true }>
							<PanelRow>
								<p>
									{ isEditedPostNew
										? __( 'Validation issues will be checked for when the post is saved.', 'amp' )
										: __( 'There are no AMP validation issues.', 'amp' ) }
								</p>
							</PanelRow>
						</PanelBody>
					) }

					{ isPostDirty && (
						<PanelBody opened={ true }>
							<PanelRow>
								<p>
									{ isEditedPostNew
										? __( 'Validation issues will be checked for when the post is saved.', 'amp' )
										: __( 'The post content has been modified since the last AMP validation.', 'amp' ) }
								</p>
							</PanelRow>
							<PanelRow>
								{ isDraft ? (
									<Button isSecondary onClick={ () => savePost( { isPreview: true } ) }>
										{ __( 'Save draft and validate now', 'amp' ) }
									</Button>
								) : (
									<Button isSecondary onClick={ () => autosave( { isPreview: true } ) }>
										{ __( 'Re-validate now', 'amp' ) }
									</Button>
								) }
							</PanelRow>
						</PanelBody>
					) }
				</>
			) }

			{ 0 < validationErrors.length && (
				0 < displayedErrors.length ? (
					<ul>
						{ displayedErrors.map( ( validationError, index ) => (
							<Error { ...validationError } key={ `${ validationError.clientId }${ index }` } />
						) ) }
					</ul>
				)
					: ! isDraft && (
						<PanelBody opened={ true }>
							<p>
								{ __( 'All AMP validation issues have been reviewed.', 'amp' ) }
							</p>
						</PanelBody>
					)
			) }

		</div>
	);
}